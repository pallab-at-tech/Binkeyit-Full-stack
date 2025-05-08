const verifyEmailTemplate = ({name , url})=>{

    return `
    <p>Dear ${name}</p>
    <p>Thank you for registering Binkeyit.</p>
    <a href=${url} style = "color: #071263 ; margin-top : 10px ; padding : 10px">
         Verify Email
    </a>
    `
}

export default verifyEmailTemplate