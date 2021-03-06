import CheckIcon from '@material-ui/icons/Check';

export function ColorPalette({ handleChange, selectedColor, isGradient, isColor, count }) {

    const colorCodes = [
        '#60bd4f', //green
        '#f2d600', //yellow
        '#ff9e1a', //orange
        '#eb5a46', //red
        '#c277e0',
        '#0279bf',
        '#52e898',
        '#ff78cb',
        '#334563',
        '#b3bac5',

    ]
    
    const gradientStyles = [
        'linear-gradient(to right, #0575e6, #021b79)', //very blue gradient
        'linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)', // pink gradient
        'linear-gradient(0deg, rgba(222,34,8,1) 0%, rgba(222,34,8,1) 91%)', //red
        'linear-gradient(0deg, rgba(151,8,222,1) 0%, rgba(151,8,222,1) 91%)', //purple
        'linear-gradient(to right, #141e30, #243b55)', //royal gradient
        'linear-gradient(0deg, rgba(113,140,156) 0%, rgba(113,140,156) 100%)',//default color

    ]

    function getStyles() {
        const styles = isGradient ? gradientStyles : colorCodes
        return count ? styles.slice(0, count) : styles
    }

    return <div className="color-palette">
        {getStyles().map(colorCode => {
            return <label key={colorCode} className="flex align-center justify-center" style={{ background: colorCode }} name="label-color" htmlFor={`color-${colorCode}`}>
                <input type="radio" name="color" id={`color-${colorCode}`} value={colorCode} onClick={handleChange} />
                {selectedColor === colorCode && <CheckIcon key={colorCode} style={{ width: '16px', height: '16px', color: 'white' }} />}
            </label>
        })}
    </div>
}