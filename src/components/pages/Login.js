import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { AuthContext } from './../../context/auth'

import { useForm } from '../../util/hooks'

export default function Login(props) {

    const context = useContext(AuthContext)

    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(LoginUserCallback, {
        username: '',
        password: '',
    })



    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }) {
            context.login(userData)
            props.history.push('/')
        },
        onError(ApolloError) {
            setErrors(ApolloError.graphQLErrors[0].extensions.errors)
        },
        variables: values,

    })


    function LoginUserCallback() {
        loginUser();
    }



    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />

                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />


                <Button type="submit">Login</Button>

            </Form>
            {Object.keys(errors).length > 0 && (<div className="ui error message">
                <ui className="list">
                    {Object.values(errors).map(value => (
                        <li key={value}>{value}</li>
                    ))}
                </ui>
            </div>)}
        </div>
    )
}


const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
  
    ) {
        login(  username: $username 
                password: $password 
                ) {
                    id email username createdAt token
                }
    }
`;