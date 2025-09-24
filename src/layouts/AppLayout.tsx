import { useEffect, useState } from 'react';
import MacToolbar from '../components/global/MacToolbar';
import MacTerminal from '../components/global/MacTerminal';
import MobileDock from '../components/global/MobileDock';
import DesktopDock from '../components/global/DesktopDock';
import NotesApp from '../components/global/NotesApp';
import GitHubViewer from '../components/global/GitHubViewer';
import ResumeViewer from '../components/global/ResumeViewer';

interface AppLayoutProps {
  initialBg: string;
  backgroundMap: Record<string, string>;
}

type TutorialStep = {
  title: string;
  content: string;
  action?: () => void;
  buttonText?: string;
};

export default function Desktop({ initialBg, backgroundMap }: AppLayoutProps) {
  const [currentBg, setCurrentBg] = useState<string>(initialBg);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const [activeApps, setActiveApps] = useState({
    terminal: false,
    notes: false,
    github: false,
    resume: false,
    spotify: false,
  });

  useEffect(() => {
    const lastBg = localStorage.getItem('lastBackground');
    const hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial') === 'true';

    if (lastBg === initialBg) {
      const bgKeys = Object.keys(backgroundMap);
      const availableBgs = bgKeys.filter((bg) => bg !== lastBg);
      const newBg =
        availableBgs[Math.floor(Math.random() * availableBgs.length)];
      setCurrentBg(newBg);
    }

    // Only show tutorial if user hasn't completed it before
    if (!hasCompletedTutorial) {
      setShowTutorial(true);
    }

    localStorage.setItem('lastBackground', currentBg);
  }, [initialBg, backgroundMap]);

  // Add this function to reset tutorial
  const resetTutorial = () => {
    setCurrentTutorialStep(0);
    setShowTutorial(true);
    localStorage.setItem('hasCompletedTutorial', 'false');
  };

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Bem-vindo ao meu portefólio! 👋",
      content: "Este é um portfólio inspirado no macOS onde pode explorar o meu trabalho e experiência. Deixe-me guiá-lo por alguns dos recursos!",
      action: () => setShowNotes(true),
      buttonText: "Vamos começar"
    },
    {
      title: "Aplicativo Notas",
      content: "Esta é a minha aplicação de notas, onde pode encontrar informações detalhadas sobre a minha formação, experiência e competências. Sinta-se à vontade para explorar!",
      action: () => {
        setShowNotes(false);
        setShowGitHub(true);
      },
      buttonText: "Próximo: Projetos"
    },
    {
      title: "Projetos GitHub",
      content: "Aqui pode navegar pelos meus projetos, ver a sua estrutura e verificar o código. Cada projeto tem capturas de ecrã e links para o repositório.",
      action: () => {
        setShowGitHub(false);
        setShowTerminal(true);
      },
      buttonText: "Próximo: Terminal"
    },
    {
      title: "Terminal",
      content: "O terminal é uma forma interativa de aprender mais sobre mim. Experimente fazer perguntas como 'Quais são as suas competências?' ou 'Conte-me a sua experiência'.",
      action: () => {
        setShowTerminal(false);
      },
      buttonText: "Próximo: Explorar"
    },
    {
      title: "Explorar",
      content: "Agora que já viu o básico, sinta-se à vontade para explorar o resto do portefólio no dock abaixo. Tenho alguns projetos e informações interessantes à sua espera!",
      action: () => {
        setShowTutorial(false);
      },
      buttonText: "Obrigado! Peguei aqui!"
    }
  ];

  const handleTutorialAction = () => {
    if (tutorialSteps[currentTutorialStep].action) {
      tutorialSteps[currentTutorialStep].action!();
    }

    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      localStorage.setItem('hasCompletedTutorial', 'true');
    }
  };

  const handleAppOpen = (app: keyof typeof activeApps) => {
    setActiveApps(prev => ({
      ...prev,
      [app]: true
    }));
  };

  const handleAppClose = (app: keyof typeof activeApps) => {
    setActiveApps(prev => ({
      ...prev,
      [app]: false
    }));
  };

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: `url(${backgroundMap[currentBg]})` }}
      />

      <div className='relative z-10'>
        <MacToolbar 
          onTerminalClick={() => setShowTerminal(true)} 
          onShowTutorial={resetTutorial}
        />
      </div>

      <div className='relative z-0 flex items-center justify-center h-[calc(100vh-10rem)] md:h-[calc(100vh-1.5rem)] pt-6'>
      </div>

      <MobileDock
        onGitHubClick={() => {
          setShowGitHub(true);
          handleAppOpen('github');
        }}
        onNotesClick={() => {
          setShowNotes(true);
          handleAppOpen('notes');
        }}
        onResumeClick={() => {
          setShowResume(true);
          handleAppOpen('resume');
        }}
        onTerminalClick={() => {
          setShowTerminal(true);
          handleAppOpen('terminal');
        }}
      />
      <DesktopDock
        onTerminalClick={() => {
          setShowTerminal(true);
          handleAppOpen('terminal');
        }}
        onNotesClick={() => {
          setShowNotes(true);
          handleAppOpen('notes');
        }}
        onGitHubClick={() => {
          setShowGitHub(true);
          handleAppOpen('github');
        }}
        activeApps={activeApps}
      />

      <NotesApp isOpen={showNotes} onClose={() => {
        setShowNotes(false);
        handleAppClose('notes');
      }} />
      <GitHubViewer isOpen={showGitHub} onClose={() => {
        setShowGitHub(false);
        handleAppClose('github');
      }} />
      <ResumeViewer isOpen={showResume} onClose={() => {
        setShowResume(false);
        handleAppClose('resume');
      }} />
      <MacTerminal isOpen={showTerminal} onClose={() => {
        setShowTerminal(false);
        handleAppClose('terminal');
      }} />
      {showTutorial && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
          <div className="bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl max-w-xs animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">{tutorialSteps[currentTutorialStep].title}</h3>
            <p className="text-sm text-gray-300 mb-4">
              {tutorialSteps[currentTutorialStep].content}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {currentTutorialStep + 1} of {tutorialSteps.length}
              </span>
              <button
                onClick={handleTutorialAction}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {tutorialSteps[currentTutorialStep].buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
