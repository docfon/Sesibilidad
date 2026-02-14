import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SensitivityModule from './modules/SensitivityModule';
import LearningModule from './modules/LearningModule';
import ProfileModule from './modules/ProfileModule';
import ContactModule from './modules/ContactModule';
import DentistPatientsModule from './modules/DentistPatientsModule';
import DentistProfileModule from './modules/DentistProfileModule';
import ResearcherDataModule from './modules/ResearcherDataModule';
import ResearcherProfileModule from './modules/ResearcherProfileModule';

import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { userProfile, loading } = useAuth();

    console.log('Dashboard Render:', { role: userProfile?.role, loading, profile: userProfile });

    if (loading) return <div>Cargando...</div>;

    // Researcher routes through Layout (Layout is role-aware, shows researcher nav)
    if (userProfile?.role === 'researcher') {
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ResearcherDataModule />} />
                    <Route path="profile" element={<ResearcherProfileModule />} />
                </Route>
            </Routes>
        );
    }

    // Dentist routes through Layout (Layout is role-aware, shows dentist nav)
    if (userProfile?.role === 'dentist') {
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<DentistPatientsModule />} />
                    <Route path="profile" element={<DentistProfileModule />} />
                </Route>
            </Routes>
        );
    }

    // Default Patient Dashboard
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<SensitivityModule />} />
                <Route path="learn" element={<LearningModule />} />
                <Route path="contact" element={<ContactModule />} />
                <Route path="profile" element={<ProfileModule />} />
            </Route>
        </Routes>
    );
}

