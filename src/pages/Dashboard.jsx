import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import SensitivityModule from './modules/SensitivityModule';
import LearningModule from './modules/LearningModule';
import ProfileModule from './modules/ProfileModule';

import ContactModule from './modules/ContactModule';

export default function Dashboard() {
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
