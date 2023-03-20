import { Modal, Button, TextField } from "@mui/material";
import styles from './signup.module.scss'
import { firaSans } from "../../utils/fonts";
import { useState } from "react";
import axios from 'axios'

export default function SignUp({ openSignUp, handleCloseSignUp, handleOpenSignupSuccess }) {
    const [usernameError, setUsernameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [emailValidityErrorMessage, setEmailValidityErrorMessage] = useState(false)
    const [passwordMatchErrorMessage, setPasswordMatchErrorMessage] = useState(false)
    const [passwordLengthErrorMessage, setPasswordLengthErrorMessage] = useState(false)
    const [emptyErrorMessage, setEmptyErrorMessage] = useState(false)
    const [usernameLengthErrorMessage, setUsernameLengthErrorMessage] = useState(false)
    const [usernameDuplicateErrorMessage, setUsernameDuplicateErrorMessage] = useState(false)
    const [emailDuplicateErrorMessage, setEmailDuplicateErrorMessage] = useState(false)
    const [generalErrorMessage, setGeneralErrorMessage] = useState(false)

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [confirmPassword, setConfirmPassword] = useState("")

    function handleInput(value) {
        setNewUser({ email: value.email, username: value.username, password: value.password })
    }

    async function signUp() {
        const emailPattern = /\S+@\S+\.\S+/

        if (newUser.username === "" || newUser.email === "" || newUser.password === "" || confirmPassword === "" || newUser.username.length < 4 || newUser.username.length > 34
            || newUser.password !== confirmPassword || !emailPattern.test(newUser.email)) {
                console.log('hit...')
                if(newUser.username === "" || newUser.email === "" || newUser.password === "" || confirmPassword === ""){
                    
                    if(newUser.username === ""){
                        setUsernameError(true)
                    }

                    if(newUser.email === ""){
                        setEmailError(true)
                    }

                    if(newUser.password === "" || confirmPassword === ""){
                        setPasswordError(true)
                    }
                    
                    setEmptyErrorMessage(true)
                    return
                }

                if(newUser.username.length < 4 || newUser.username.length > 34){
                    setUsernameError(true)
                    setUsernameLengthErrorMessage(true)
                }

                if(newUser.password.length < 8 || newUser.password.length > 34 || newUser.password !== confirmPassword){
                    
                    if(newUser.password.length < 8 || newUser.password.length > 34 ){
                        setPasswordLengthErrorMessage(true)
                    } else {
                        setPasswordMatchErrorMessage(true)
                    }
                    setPasswordError(true)
                }
  
                if(!emailPattern.test(newUser.email)){
                    setEmailError(true)
                    setEmailValidityErrorMessage(true)
                }

                return
        }

        try {
            console.log('hit?')
            const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/`, newUser)
            handleCloseSignUp()
            setNewUser({
                username: "",
                email: "",
                password: ""
            })
            setConfirmPassword("")
            handleOpenSignupSuccess()
            console.log(result)
        } catch (error) {
            console.log(error)
            if (error.response.data.message === "Email already in use.") {
                setEmailDuplicateErrorMessage(true)
            } else if (error.response.data.message === "Username already in use.") {
                setUsernameDuplicateErrorMessage(true)
            } else {
                setGeneralErrorMessage(true)
            }
        }
    }

    return (
        <Modal
            open={openSignUp}
            onClose={handleCloseSignUp}
            disableAutoFocus={true}
        >
            <div className={styles['signup-wrapper']}>
                <div className={styles['title']}>
                    <span className={firaSans.className}>
                        Sign Up
                    </span>
                </div>
                <div className={styles['signup-inputs']}>
                        <TextField
                            label="Email"
                            error={emailError}
                            value={newUser.email}
                            onChange={(e) => {
                                handleInput({
                                    username: newUser.username,
                                    email: e.target.value,
                                    password: newUser.password
                                })
                                setEmailError(false)
                                setEmptyErrorMessage(false)
                                setEmailDuplicateErrorMessage(false)
                                setEmailValidityErrorMessage(false)
                            }}
    
                        />
                        {emailValidityErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Must be a valid email</span></span> : <></>}
                    <TextField
                        label="Username"
                        error={usernameError}
                        value={newUser.username}
                        onChange={(e) => {
                            handleInput({
                                username: e.target.value,
                                email: newUser.email,
                                password: newUser.password
                            })
                            setUsernameError(false)
                            setEmptyErrorMessage(false)
                            setUsernameLengthErrorMessage(false)
                            setUsernameDuplicateErrorMessage(false)
                        }}
                        
                        />
                    {usernameDuplicateErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Username already in use, please choose another</span></span> : <></>}
                    {usernameLengthErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Username must be between 4-34 characters</span></span> : <></>}
                    <TextField
                        label="Password"
                        error={passwordError}
                        value={newUser.password}
                        type="password"
                        onChange={(e) => {
                            handleInput({
                                username: newUser.username,
                                email: newUser.email,
                                password: e.target.value
                            })
                            setPasswordError(false)
                            setEmptyErrorMessage(false)
                            setPasswordLengthErrorMessage(false)
                            setPasswordMatchErrorMessage(false)
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        error={passwordError}
                        value={confirmPassword}
                        type="password"
                        onChange={(e) => {
                            setPasswordError(false)
                            setEmptyErrorMessage(false)
                            setPasswordLengthErrorMessage(false)
                            setPasswordMatchErrorMessage(false)
                            setConfirmPassword(e.target.value)
                        }}
                    />
                    {passwordLengthErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Password must be between 8-34 characters</span></span> : <></>}
                    {passwordMatchErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Passwords do not match</span></span> : <></>}
                    {emailDuplicateErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Email already in use, please choose another</span></span> : <></>}
                    {generalErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Error on our side, please try again</span></span> : <></>}
                    {emptyErrorMessage ? <span className={styles['error-text']}><span className={firaSans.className}>Please fill out the entire form</span></span> : <></>}
                </div>
                <ul className={firaSans.className}>
                    <li>Username must be between 4-34 characters</li>
                    <li>Must be valid email</li>
                    <li>Password must be between 8-34 characters</li>
                </ul>
                <div className={styles['signup-buttons']}>
                    <Button
                        variant="contained"
                    >Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={signUp}

                    >Sign Up</Button>
                </div>
            </div>
        </Modal>
    )
}