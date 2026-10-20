import React from 'react'
// ref: https://tanstack.com/table/v8/docs/framework/react/examples/kitchen-sink
export const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = React.useState < number | string > (initialValue)

    const handleInputChange = (event) =>
        setValue(event.target.value)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return <input {...props} value={value} onChange={handleInputChange} />
}

export default DebouncedInput
