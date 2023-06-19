import { useLocation } from "react-router-dom"

const DocumentViewer = () => {
    const location = useLocation();
    const file = location.state.file;

    const style = {
        width: "100%",
        height: "100vh"
    }

    return (
        <div>
            {console.log('Ok till here')}
            <iframe style={style} src={require(`./Files/${file}`)} />
        </div>
    )
}

export default DocumentViewer