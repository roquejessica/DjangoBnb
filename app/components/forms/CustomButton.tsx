// create an interface for the props so we can define the properties that we can send

interface CustomButtonProps {  
    label: string
    className?: string
    onClick: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    className,
    onClick
}) => {  //to pass it in the interface and set it to be used on the CustomButton, we convert the component to be react functional component
    return (
        <div
            onClick={onClick}
            className={`w-full py-4 bg-airbnb hover:bg-airbnb-dark text-white text-center rounded-xl transition cursor-pointer ${className}`}
        >
            {label}
        </div>
    )
}

export default CustomButton