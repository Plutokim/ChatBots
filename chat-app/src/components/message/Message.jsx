import './message.scss'

const Message = ({style, direction, message}) => {

    return(
        <li className={style}>
            <div className="msgInfo">
                <h3 className="msgUsername">{message.by}</h3>
                <p className="msgDate">{message.time}</p>
            </div>
                    <p className="msgText">{message.msg}</p>
            <div className={direction}></div>
        </li>
    );

}

export default Message;