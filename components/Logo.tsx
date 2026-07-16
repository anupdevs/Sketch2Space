import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className, ...props }) => {
    return (
        <img
            src="/logo.png"
            alt="Sketch2Space"
            width={size}
            height={size}
            className={className}
            {...props}
        />
    );
};

export default Logo;
