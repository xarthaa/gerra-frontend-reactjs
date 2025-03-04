import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { useParams, Link, Redirect, useHistory } from "react-router-dom";
import Layout from "./Layout";
import Input from "../MainInput";
import Label from "../Label";
import ErrorLabel from "../ErrorLabel";
import MainBtn from "../MainButton";
import SecBtn from "../SecondaryButton";
import GoogleBtn from "../GoogleLoginButton";
import isAuth from "../services/isAuth";
import Checkbox from "../Checkbox";
import MainInput from "../MainInput";
import CurrencyFormat from "react-currency-format";

const Register = ({ id, callback }) => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    termsAgree: false,
    termsAgreeError: false,
    termsAgreeErrorLabel: "",
    name: "",
    isNameError: false,
    nameErrorLabel: "",
    email: "",
    isEmailError: false,
    emailErrorLabel: "",
    phone: "",
    isPhoneError: false,
    phoneErrorLabel: "",
    password: "",
    isPasswordError: false,
    passwordErrorLabel: "",
    password_confirmation: "",
    isPassword_confirmationError: false,
    password_confirmationErrorLabel: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    isAuth();
  }, []);

  const { id_params } = useParams();

  const path = window.location.pathname;

  if (["/user/register", "/organization/register"].includes(path)) {
    id = id_params;
    if (!["user", "organization"].includes(id_params)) {
      return <Redirect to="/login" />;
    }
  }

  const loginHandler = async () => {
    setLoading(true);
    apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient
        .post("/api/v1/register", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          roles: id === "user" ? 1 : 0,
          timezone: formData.timezone,
        })
        .then((response) => {
          if (response.status === 200) {
            apiClient
              .post("/api/v1/login", {
                email: formData.email,
                password: formData.password,
                roles: id === "user" ? 1 : 0,
                timezone: formData.timezone,
              })
              .then((response) => {
                setLoading(false);
                if (response.status === 200) {
                  return ["/user/register", "/organization/register"].includes(
                    path
                  )
                    ? history.push(id === "user" ? "/" : "/complete-profile")
                    : window.location.reload();
                }
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.status === 422) {
            if (error.response.data.email) {
              setformData({
                ...formData,
                isEmailError: true,
                emailErrorLabel: "Email telah digunakan, pake yang lain!",
              });
            }
            if (error.response.data.name) {
              setformData({
                ...formData,
                isNameError: true,
                nameErrorLabel: "Nama terlalu panjang kawan",
              });
            }
          } else {
            setformData({
              ...formData,
              isPhoneError: true,
              phoneErrorLabel: "No. Hp sudah digunakan",
            });
          }
        });
    });
  };

  const loginGoogle = async () => {
    setLoading(true);
    await apiClient.get("/sanctum/csrf-cookie").then((response) => {
      apiClient.get("/api/v1/auth/google").then((response) => {
        return (window.location.href = response.data);
      });
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      formData.email &&
      formData.password &&
      formData.name &&
      formData.termsAgree
    ) {
      setformData({
        ...formData,
        isNameError: false,
      });
      await loginHandler();
    } else if (!formData.name) {
      setformData({
        ...formData,
        isNameError: true,
        nameErrorLabel: "Nama tidak boleh kosong",
      });
    } else if (!formData.email) {
      setformData({
        ...formData,
        isEmailError: true,
        emailErrorLabel: "Email tidak boleh kosong",
      });
    } else if (!formData.password) {
      setformData({
        ...formData,
        isPasswordError: true,
        passwordErrorLabel: "Password tidak boleh kosong",
      });
    } else if (!formData.phone) {
      setformData({
        ...formData,
        isPhoneError: true,
        phoneErrorLabel: "No. Hp tidak boleh kosong",
      });
    } else if (!formData.termsAgree) {
      setformData({
        ...formData,
        termsAgreeError: true,
        termsAgreeErrorLabel: "Kamu harus setuju dulu kawan",
      });
    }
  };
  return (
    <Layout>
      <React.Fragment>
        <div
          className={
            ["/user/register", "/organization/register"].includes(path)
              ? `pt-20 md:pt-36`
              : ``
          }
        >
          <div
            className={
              ["/user/register", "/organization/register"].includes(path)
                ? `flex max-w-sm mx-auto overflow-hidden bg-white rounded-lg lg:shadow-lg dark:bg-gray-800 lg:max-w-1/2`
                : ``
            }
          >
            <div className="w-full px-6 py-8 md:px-8">
              <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
                Daftar Sebagai {id === "user" ? "Pembeli" : "Organisasi"}
              </h2>
              {/*
                    <GoogleBtn
                        type="button"
                        label={isLoading ? `Loading...` : `Masuk dengan Google`}
                        disabled={isLoading}
                        onClick={() => {
                            loginGoogle();
                        }}
                    />
                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"/>

                        <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                            or register with email
                        </div>

                        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"/>
                    </div>*/}
              <form onSubmit={handleRegister} method="post">
                <div className="pt-4">
                  <Label label="Name" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        name: e.target.value,
                        isNameError: false,
                      })
                    }
                    name="name"
                    min={5}
                    type="text"
                  />
                  {formData.isNameError ? (
                    <ErrorLabel label={formData.nameErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="pt-4">
                  <Label label="Email Address" />
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        email: e.target.value,
                        isEmailError: false,
                      })
                    }
                    placeholder={"cth: user@gmail.com"}
                    name="email"
                    type="email"
                  />
                  {formData.isEmailError ? (
                    <ErrorLabel label={formData.emailErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="pt-4">
                  <Label label="No. Hp" />
                  <CurrencyFormat
                    customInput={MainInput}
                    value={formData.phone.toString()}
                    type="text"
                    placeholder={"cth: 081234567890"}
                    onChange={(e) => {
                      setformData({
                        ...formData,
                        phone: e.target.value,
                        isPhoneError: false,
                      });
                    }}
                  />
                  {formData.isPhoneError ? (
                    <ErrorLabel label={formData.phoneErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-4">
                  <Label label="Password" />
                  <Input
                    maxLength={30}
                    value={formData.password}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        password: e.target.value,
                        isPasswordError: false,
                      })
                    }
                    name="password"
                    type="password"
                  />
                  {formData.isPasswordError ? (
                    <ErrorLabel label={formData.passwordErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className={"mt-4"}>
                  <div className={"flex"}>
                    <Checkbox
                      onChange={(e) => {
                        setformData({
                          ...formData,
                          termsAgree: e.target.checked,
                          termsAgreeError: false,
                        });
                      }}
                    />
                    <p className={"text-sm"}>
                      Dengan ini saya telah membaca & setuju dengan{" "}
                      <a
                        target={"_blank"}
                        href={
                          "https://assets-gerra.s3.ap-southeast-1.amazonaws.com/TERMS+TOKOEVENT.pdf"
                        }
                        className={
                          "font-semibold text-blue-600 hover:text-blue-400 duration-500"
                        }
                      >
                        syarat dan ketentuan
                      </a>{" "}
                      yang berlaku
                    </p>
                  </div>
                  {formData.termsAgreeError ? (
                    <ErrorLabel label={formData.termsAgreeErrorLabel} />
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-2">
                  <SecBtn
                    type="button"
                    label="Kembali"
                    disabled={isLoading}
                    onClick={() => {
                      ["/user/register", "/organization/register"].includes(
                        path
                      )
                        ? history.push("/" + id + "/login")
                        : callback("");
                    }}
                  />
                  <MainBtn
                    type="submit"
                    disabled={isLoading}
                    label={isLoading ? "Loading.." : "Daftar"}
                  />
                </div>
              </form>
              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />

                <p
                  onClick={() => {
                    ["/user/register", "/organization/register"].includes(path)
                      ? history.push("/" + id + "/login")
                      : callback("");
                  }}
                  className="text-md cursor-pointer text-gray-500 dark:text-gray-400 hover:underline"
                >
                  Sudah punya akun? Login
                </p>

                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </Layout>
  );
};
export default Register;
