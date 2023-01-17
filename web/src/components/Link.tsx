// Utilize o componente Link para não ocorrer o recarregamento da página.
import { Link as LinkRouter } from "react-router-dom"

interface LinkProps {
    text: string
    redirect: string
}

export default function Link(props :LinkProps) {
    return (
        <LinkRouter to={props.redirect}>
            {props.text}
        </LinkRouter>
    )
}