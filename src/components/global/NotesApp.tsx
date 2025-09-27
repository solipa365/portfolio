import { useState } from 'react';
import {
    FaGraduationCap, FaBriefcase, FaChevronLeft, FaBookOpen,
    FaCode, FaUsers, FaPalette, FaTrophy
} from 'react-icons/fa';
import { userConfig } from '../../config/userConfig';
import DraggableWindow from './DraggableWindow';

interface NotesAppProps {
    isOpen: boolean;
    onClose: () => void;
}

type Section =
    | 'menu'
    | 'education'
    | 'experience'
    | 'courses'
    | 'skills'
    | 'roles'
    | 'activities'
    | 'competitions';

// Tipo para Armazenar Índices de Imagem por Item
type ImageIndicesState = Record<string, number>;

interface Image {
    url: string;
    alt?: string;
    description?: string;
}

const NotesApp = ({ isOpen, onClose }: NotesAppProps) => {
    const [activeSection, setActiveSection] = useState<Section>('menu');
    // Store image indices in an object: { 'itemId': index }
    const [activeImageIndices, setActiveImageIndices] = useState<ImageIndicesState>({});

    const handleSectionClick = (section: Section) => {
        setActiveSection(section);
        // Não há necessidade de redefinir os índices de imagem globalmente aqui,
        // eles são por item agora e serão definidos como 0 se não forem definidos
    };

    const handleBackClick = () => {
        setActiveSection('menu');
    };

    // Atualizar Índice de Imagem para um Item Específico
    const handleNextImage = (itemId: string, images: readonly Image[]) => {
        setActiveImageIndices(prevIndices => ({
            ...prevIndices,
            [itemId]: ((prevIndices[itemId] ?? -1) + 1) % images.length
        }));
    };

    // Atualizar Índice de Imagem para um Item Específico
    const handlePrevImage = (itemId: string, images: readonly Image[]) => {
        setActiveImageIndices(prevIndices => ({
            ...prevIndices,
            [itemId]: ((prevIndices[itemId] ?? 0) - 1 + images.length) % images.length
        }));
    };

    if (!isOpen) return null;

    const education = userConfig.education || [];
    const experience = userConfig.experience || [];
    const courses = userConfig.courses || [];
    const skills = userConfig.skills || [];
    const roles = userConfig.extraCurricularRoles || [];
    const activities = userConfig.extraCurricularActivities || [];
    const competitions = userConfig.competitions || [];

    const renderBackButton = () => (
        <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-300 hover:text-gray-100 mb-4"
        >
            <FaChevronLeft />
            <span>Voltar ao menu</span>
        </button>
    );

    // Aceita itemId para Gerenciar o Estado Corretamente
    const renderImageCarousel = (itemId: string, images: readonly Image[]) => {
        const currentIndex = activeImageIndices[itemId] ?? 0;
        if (!images || images.length === 0 || currentIndex >= images.length) {
            return null;
        }

        return (
            <div className="mt-4">
                <div className="rounded-lg overflow-hidden mb-2">
                    <img
                        src={images[currentIndex].url}
                        alt={images[currentIndex].alt}
                        className="w-full h-48 object-contain bg-gray-900 rounded-lg"
                    />
                </div>

                <div className="text-sm text-gray-400 mb-3">
                    {images[currentIndex].description}
                </div>

                {images.length > 1 && (
                    <div className="flex justify-between mt-2">
                        <button
                            onClick={() => handlePrevImage(itemId, images)}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ←
                        </button>
                        <span className="text-gray-400">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <button
                            onClick={() => handleNextImage(itemId, images)}
                            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderEducation = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Educação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((item, index) => {
                    const itemId = `education-${index}`;
                    return (
                        <div key={itemId} className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.degree} {item.major && `- ${item.major}`}</h3>
                            <div className="text-gray-300 mb-2">{item.institution}, {item.location}</div>
                            <div className="text-gray-400 mb-3">{item.year}</div>
                            <p className="text-gray-300 mb-4">{item.description}</p>
                            {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderExperience = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Experiência Profissional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experience.map((item, index) => {
                    const itemId = `experience-${index}`;
                    return (
                        <div key={itemId} className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.title}</h3>
                            <div className="text-gray-300 mb-2">{item.company}, {item.location}</div>
                            <div className="text-gray-400 mb-3">{item.period}</div>
                            <p className="text-gray-300 mb-4">{item.description}</p>
                            {item.technologies && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {item.technologies.map((tech, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Cursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((item, index) => {
                    const itemId = `courses-${index}`;
                    return (
                        <div key={itemId} className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.title}</h3>
                            <div className="text-gray-400 mb-3">Emitido por: {item.institution}</div>
                            <div className="text-gray-400 mb-3">Emitido para: {item.teacher}</div>
                            <div className="text-gray-400 mb-3">Tipo de conteúdo: {item.contenttype}</div>
                            <div className="text-gray-400 mb-3">Data de emissão: {item.dateofissue}</div>
                            <div className="text-gray-400 mb-3">Carga horária: {item.workload}</div>
                            <div className="text-gray-400 mb-3 break-all">
                                Código de validação: {item.validationcode}
                            </div>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline mb-4 block"
                                >
                                Exibir Credencial
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Competências</h2>
            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700 rounded text-sm text-gray-300">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderExtraCurricularRoles = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Funções Extracurriculares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((item, index) => {
                    const itemId = `roles-${index}`;
                    return (
                        <div key={itemId} className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.role}</h3>
                            <div className="text-gray-300 mb-2">{item.institution}, {item.location}</div>
                            <div className="text-gray-400 mb-3">{item.year}</div>
                            {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderExtraCurricularActivities = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Atividades Extracurriculares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((item, index) => {
                    const itemId = `activities-${index}`;
                    return (
                        <div key={itemId} className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.title}</h3>
                            <div className="text-gray-300 mb-2">{item.institution}, {item.location}</div>
                            <div className="text-gray-400 mb-3">{item.year}</div>
                            {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderCompetitions = () => (
        <div className="space-y-6">
            {renderBackButton()}
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Competições</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {competitions.map((item, index) => {
                    const itemId = `competitions-${index}`;
                    return (
                        <div key={itemId} className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-200 mb-2">{item.title}</h3>
                            <div className="text-gray-300 mb-2">{item.description}</div>
                            <div className="text-gray-400 mb-3">Achievement: {item.achievement} ({item.year})</div>
                            {item.images && item.images.length > 0 && renderImageCarousel(itemId, item.images)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderMenu = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Minhas Anotações</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Notas de Competições */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('competitions')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                            <FaTrophy size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Competições</h3>
                    </div>
                    <p className="text-gray-400">Veja o meu histórico de competições e conquistas</p>
                </div>

                {/* Notas de Educação */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('education')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FaGraduationCap size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Educação</h3>
                    </div>
                    <p className="text-gray-400">Veja a minha formação educacional e qualificações</p>
                </div>

                {/* Notas de Experiência */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('experience')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                            <FaBriefcase size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Experiência profissional</h3>
                    </div>
                    <p className="text-gray-400">Explore a minha experiência profissional</p>
                </div>
                {/* Notas de Funções Extracurriculares */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('roles')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <FaUsers size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Funções extracurriculares</h3>
                    </div>
                    <p className="text-gray-400">O meu envolvimento em atividades e funções estudantis</p>
                </div>

                {/* Notas de Atividades Extracurriculares */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('activities')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                            <FaPalette size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Atividades extracurriculares</h3>
                    </div>
                    <p className="text-gray-400">A minha participação em eventos e atividades</p>
                </div>
                {/* Notas de Cursos */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('courses')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                            <FaBookOpen size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Cursos</h3>
                    </div>
                    <p className="text-gray-400">Confira os cursos que concluí</p>
                </div>

                {/* Notas de Competências */}
                <div
                    className="bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                    onClick={() => handleSectionClick('skills')}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                            <FaCode size={28} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200">Competências</h3>
                    </div>
                    <p className="text-gray-400">Veja as minhas competências técnicas e experiência</p>
                </div>
            </div>
        </div>
    );

    const getWindowTitle = () => {
        switch (activeSection) {
            case 'menu': return 'Notas';
            case 'education': return 'Notas de Educação';
            case 'experience': return 'Notas de Experiência';
            case 'courses': return 'Notas de Cursos';
            case 'skills': return 'Notas de Competências';
            case 'roles': return 'Notas de Funções Extracurriculares';
            case 'activities': return 'Notas de Atividades Extracurriculares';
            case 'competitions': return 'Notas de Competições';
            default: return 'Notas';
        }
    };

    return (
        <DraggableWindow
            title={getWindowTitle()}
            onClose={onClose}
            initialPosition={{ 
                x: Math.floor(window.innerWidth * 0.3), 
                y: Math.floor(window.innerHeight * 0.2) 
            }}
            className="w-[93vw] md:max-w-4xl max-h-[90vh] flex flex-col"
            initialSize={{ width: 700, height: 600 }}
        >
            <div className="flex flex-col flex-grow min-h-0 h-full">
                <div className="overflow-y-auto flex-grow min-h-0 p-4 md:p-6">
                    {activeSection === 'menu' && renderMenu()}
                    {activeSection === 'education' && renderEducation()}
                    {activeSection === 'experience' && renderExperience()}
                    {activeSection === 'courses' && renderCourses()}
                    {activeSection === 'skills' && renderSkills()}
                    {activeSection === 'roles' && renderExtraCurricularRoles()}
                    {activeSection === 'activities' && renderExtraCurricularActivities()}
                    {activeSection === 'competitions' && renderCompetitions()}
                </div>
            </div>
        </DraggableWindow>
    );
};

export default NotesApp; 