import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { OTPVerify } from "./components/OTPVerify";
import { BioDataPreview } from "./pages/BioDataPreview";
import { Home } from "./pages/Home";
import { PublicBioDataView } from "./pages/PublicBioDataView";
import { SharePrivacySettings } from "./pages/SharePrivacySettings";
import { Step1PersonalDetails } from "./pages/BioDataForm/Step1_PersonalDetails";
import { Step2Photos } from "./pages/BioDataForm/Step2_Photos";
import { Step3Family } from "./pages/BioDataForm/Step3_Family";
import { Step4Horoscope } from "./pages/BioDataForm/Step4_Horoscope";
import { Step5ChooseTemplate } from "./pages/BioDataForm/Step5_ChooseTemplate";
import { Step6Review } from "./pages/BioDataForm/Step6_Review";
import { store } from "./store";

const defaultApiUrl = "http://localhost:3000";

export function getHealthCheckUrl(apiUrl = import.meta.env.VITE_API_URL ?? defaultApiUrl) {
  return `${apiUrl.replace(/\/$/, "")}/api/health`;
}

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/verify" element={<OTPVerify />} />
              <Route path="/biodata" element={<Navigate to="/biodata/personal" replace />} />
              <Route path="/biodata/personal" element={<Step1PersonalDetails />} />
              <Route path="/biodata/photos" element={<Step2Photos />} />
              <Route path="/biodata/family" element={<Step3Family />} />
              <Route path="/biodata/horoscope" element={<Step4Horoscope />} />
              <Route path="/biodata/template" element={<Step5ChooseTemplate />} />
              <Route path="/biodata/review" element={<Step6Review />} />
              <Route path="/preview" element={<BioDataPreview />} />
              <Route path="/shares" element={<SharePrivacySettings />} />
              <Route path="/share/:token" element={<PublicBioDataView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}
