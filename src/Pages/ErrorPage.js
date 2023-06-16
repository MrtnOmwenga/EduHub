import errorstyle from './Style/Errorpage.module.css'

const ErrorPage = () => {
    return (
        <div className={errorstyle.error_div}>
            <h3> Sorry. &ensp;Something went wrong. &ensp;Please try again later. </h3>
        </div>
    )
}

export default ErrorPage