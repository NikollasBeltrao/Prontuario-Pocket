import React from 'react'

interface HeaderProps {
    title?: String
    match?: {
        params?: {
            teste?: String
        }
    }
}
const Header: React.FC<HeaderProps> = (props) => {
    console.log(props);
    return (
        <header className="header">
            <h1>{props?.match?.params?.teste}</h1>
        </header>
    );

} 
export default Header;