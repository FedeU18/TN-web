import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Title */}
            <h1 className="home-title">
                Track Now
            </h1>
            <p className="home-subtitle">
                {t("home.subtitle")}
            </p>

            {/* Buttons */}
            <div className="home-buttons">
                <button onClick={() => navigate('/register')}
                    className="btn btn-register"
                >
                    {t("home.register")}
                </button>
                <button onClick={() => navigate('/login')}
                    className="btn btn-login"
                >
                    {t("home.login")}
                </button>
            </div>
        </div>
    );


}
