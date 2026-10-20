const TextArea = ({...props }:any) => {
    return(
        <textarea
        {...props }
        rows={4} cols={50}
        className={`border ${props.error ? 'border-[#ff0000]' : 'border-[#004080]'} p-4 w-[100%] rounded-[7px] placeholder-black`}
        placeholder='Describe what you want to send...'
    />
    )
}
export default TextArea;