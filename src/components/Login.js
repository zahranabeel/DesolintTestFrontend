import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import instance from "../Axios";
import Swal from 'sweetalert2';
import AppContext from "../AppContext";

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = React.useContext(AppContext);

    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = yup.object({
        email: yup.string().required("Email is Required").email("invalid"),
        password: yup.string().required("password is Required")
    });

    const handleLogin = async (values) => {
        try {
            const response = await instance.request({
                url: "/auth",
                method: "post",
                data: values
            })
            window.localStorage.setItem("token", response.data.token);
            setUser(response.data)
            navigate("/");
        } catch (error) {
            console.log(error, "error");
            Swal.fire({
                title: 'Error!',
                text: error.response.data.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
    };

    return (
        <>
            <Container maxWidth="sm" style={{ padding: "5%" }}>
                <h1>Login</h1>
                <Formik
                //validateOnChange={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    handleLogin(values)
                }}
                >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                        <form
                        onSubmit={handleSubmit}
                        >
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={values.email}
                                onChange={handleChange}
                            />

                            {errors.email && touched.email ? <p>{errors.email}</p> : null}

                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={values.password}
                                onChange={handleChange}
                            />
                            {errors.password && touched.password ? <p>{errors.password}</p> : null}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Log In
                            </Button>
                        </form>
                    )}

                </Formik>


            </Container>
        </>
    );
};

export default Login;