import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import instance from "../Axios";
import {isEmpty} from "lodash";

const UserInformation = () => {
    const navigate = useNavigate();
    const token = window.localStorage.getItem("token");
    const [images, setImages] = React.useState([]);
    const [imagePreview, setImagePreview] = React.useState([]);

    const initialValues = {
        carModel: "",
        price: "",
        phoneNo: "",
        city: '',
    };

    const validationSchema = yup.object({
        carModel: yup.string().required("carModel is Required").min(3),
        price: yup.number().required("Price is Required"),
        phoneNo: yup.string().required("Phone No is required").matches(/^\d+$/, 'Must be a number').length(11, 'Number must be exactly 11 digits'),
        city: yup.string().required("City is Required"),
    });

    const handleImages = (e) => {
        let imageArray = [...images];
        imageArray.push(e.target.files);
        setImages(imageArray[0]);
    };

    const handleImageChange = (e) => {
        let imagePreviewArray = [...imagePreview];
        const fileList = Array.from(e.target.files);

        const mappedFiles = fileList.map((file) => ({
            ...file,
            preview: URL.createObjectURL(file),
        }));
        imagePreviewArray.push(mappedFiles);
        imagePreviewArray = imagePreviewArray.flat(1);
        setImagePreview(imagePreviewArray);
    };

    const handleSubmitUserDetail = async (values) => {
        try {
            let formData = new FormData();
            formData.append("carModel", values.carModel);
            formData.append("price", values.price);
            formData.append("phoneNo", values.phoneNo);
            formData.append("city", values.city);
            Array.from(images).forEach(image => {
                console.log(image, "image")
                formData.append("images", image);
            })
            const response = await instance.request({
                url: `/user`,
                method: "post",
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`,
                },
                data: formData
            })
            console.log(response, "resss");
            alert(response.data.message);
            values.carModel = '';
            values.price = '';
            values.phoneNo = '';
            values.city = '';
            setImages([]);
            setImagePreview([]);

        } catch (error) {
            console.log(error)
            if (error.response.status == 401) {
                alert("Unauthorized");
                localStorage.removeItem("token");
                navigate("/login")
            } else {
                //setResMsg(error.response.data.message);
            }
        }
    };

    return (
        <>
            <Container maxWidth="sm">

                <Formik
                    //validateOnChange={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSubmitUserDetail(values)
                    }}
                >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                        <form
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                label="Car Model"
                                name="carModel"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={values.carModel}
                                onChange={handleChange}
                            />

                            {errors.carModel && touched.carModel ? <p>{errors.carModel}</p> : null}

                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={values.price}
                                onChange={handleChange}
                            />
                            {errors.price && touched.price ? <p>{errors.price}</p> : null}

                            <TextField
                                label="Phone Number"
                                name="phoneNo"
                                type="number"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={values.phoneNo}
                                onChange={handleChange}

                            />
                            {errors.phoneNo && touched.phoneNo ? <p>{errors.phoneNo}</p> : null}

                            <TextField
                                label="City"
                                name="city"
                                type="text"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={values.city}
                                onChange={handleChange}
                            />
                            {errors.city && touched.city ? <p>{errors.city}</p> : null}

                            <input
                                type="file"
                                name="images"
                                id="actual-btn"
                                multiple="multiple"
                                style={{ marginBottom: "5%" }}
                                onChange={(e) => (handleImages(e), handleImageChange(e))}
                            />

                            <div style={{ display: "flex", flexDirection: "row" }}>
                                {!isEmpty(imagePreview) &&
                                    imagePreview?.map((image, index) => {
                                        return (
                                            <>
                                                <img key={index} src={image.preview} alt="image" style={{ width: "30%", height: 100, marginRight: "3%" }} />
                                            </>
                                        )
                                    })
                                }
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth

                            >
                                Save
                            </Button>

                        </form>
                    )}

                </Formik>


            </Container>
        </>
    );
};

export default UserInformation;