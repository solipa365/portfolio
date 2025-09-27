import { useState, useEffect, useRef } from 'react';
import { BsGithub, BsSpotify, BsFilePdf, BsStickyFill, BsCalendar, BsFillTrash2Fill, BsFillFolderFill, } from 'react-icons/bs';
import { RiTerminalFill, } from 'react-icons/ri';
import { IoIosCall, IoIosMail } from 'react-icons/io';
import { VscVscodeInsiders } from "react-icons/vsc";
import { FaLink, FaLinkedin, FaGithub, FaFacebook, FaFacebookMessenger, FaInstagram, FaWhatsapp, FaTelegram, FaDiscord, FaYoutube, FaTwitch, FaTiktok, FaTwitter, FaReddit, FaSnapchat, FaPinterest, } from 'react-icons/fa';
import ResumeViewer from './ResumeViewer';
import SpotifyPlayer from './SpotifyPlayer';
import { userConfig } from '../../config/userConfig';

interface DesktopDockProps {
  onTerminalClick: () => void;
  onNotesClick: () => void;
  onGitHubClick: () => void;
  activeApps: {
    folder: boolean;
    delete: boolean;
    terminal: boolean;
    notes: boolean;
    github: boolean;
    resume: boolean;
    spotify: boolean;
  };
}

const DesktopDock = ({ onTerminalClick, onDeleteClick, onFolderClick, onNotesClick, onGitHubClick, activeApps }: DesktopDockProps) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showLinksPopup, setShowLinksPopup] = useState(false);
  const linksPopupRef = useRef<HTMLDivElement>(null);

  const handleLinksClick = () => {
    setShowLinksPopup(!showLinksPopup);
  };

  const handleCalendarClick = () => {
    window.open(userConfig.contact.calendly, '_blank');
  };

  const handleSpotifyClick = () => {
    setShowSpotify(true);
  };

  const handleResumeClick = () => {
    setShowResume(true);
  };

  const handleCloseResume = () => {
    setShowResume(false);
  };

  const handleCloseSpotify = () => {
    setShowSpotify(false);
  };

  const handleVSCodeClick = () => {
    window.location.href = 'vscode:/';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (linksPopupRef.current && !linksPopupRef.current.contains(event.target as Node)) {
        setShowLinksPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
      {text}
    </div>
  );

  const LinksPopup = () => (
    <div
      ref={linksPopupRef}
      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800/90 w-35 backdrop-blur-sm rounded-lg p-4 shadow-xl"
    >
      <div className="grid grid-cols-1 gap-y-2">
      <a
          href={`tel:${userConfig.contact.phone}`}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <IoIosCall size={20} />
          <span>Telemovel</span>
        </a>
      <a
          href={`mailto:${userConfig.contact.email}`}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <IoIosMail size={20} />
          <span>Email</span>
        </a>
        <a
          href={userConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaLinkedin size={20} />
          <span>LinkedIn</span>
        </a>
        <a
          href={userConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaGithub size={20} />
          <span>GitHub</span>
        </a>
        <a
          href={userConfig.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaFacebook size={20} />
          <span>Facebook</span>
        </a>
        <a
          href={userConfig.social.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaFacebookMessenger size={20} />
          <span>Messenger</span>
        </a>
        <a
          href={userConfig.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaInstagram size={20} />
          <span>Instagram</span>
        </a>
        <a
          href={userConfig.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaWhatsapp size={20} />
          <span>Whatsapp</span>
        </a>
        <a
          href={userConfig.social.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaTelegram size={20} />
          <span>Telegram</span>
        </a>
        <a
          href={userConfig.social.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaDiscord size={20} />
          <span>Discord</span>
        </a>
        <a
          href={userConfig.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaYoutube size={20} />
          <span>Youtube</span>
        </a>
        <a
          href={userConfig.social.twitch}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaTwitch size={20} />
          <span>Twitch</span>
        </a>
        <a
          href={userConfig.social.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaTiktok size={20} />
          <span>Tiktok</span>
        </a>
        <a
          href={userConfig.social.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaTwitter size={20} />
          <span>Twitter</span>
        </a>
        <a
          href={userConfig.social.reddit}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaReddit size={20} />
          <span>Reddit</span>
        </a>
        <a
          href={userConfig.social.snapchat}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaSnapchat size={20} />
          <span>Snapchat</span>
        </a>
        <a
          href={userConfig.social.pinterest}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaPinterest size={20} />
          <span>Pinterest</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 hidden md:flex justify-center pb-4 z-100">
        <div className="bg-gray-600/50 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
          <div className="flex space-x-2">
            {/* GitHub */}
            <button
              onClick={onGitHubClick}
              onMouseEnter={() => setHoveredIcon('github')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.github ? 'ring-2 ring-white/50' : ''}`}>
                <BsGithub size={35} className='text-gray-100' />
              </div>
              {hoveredIcon === 'github' && <Tooltip text='GitHub' />}
            </button>

            {/* Notes */}
            <button
              onClick={onNotesClick}
              onMouseEnter={() => setHoveredIcon('notes')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.notes ? 'ring-2 ring-white/50' : ''}`}>
                <BsStickyFill size={35} className='text-white' />
              </div>
              {hoveredIcon === 'notes' && <Tooltip text='Notas do Currículo' />}
            </button>

            {/* Resume */}
            <button
              onClick={handleResumeClick}
              onMouseEnter={() => setHoveredIcon('resume')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-red-600 to-red-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.resume ? 'ring-2 ring-white/50' : ''}`}>
                <BsFilePdf size={35} className='text-white' />
              </div>
              {hoveredIcon === 'resume' && <Tooltip text='Ver Currículo' />}
            </button>

            {/* Calendar */}
            <button
              onClick={handleCalendarClick}
              onMouseEnter={() => setHoveredIcon('calendar')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className='w-12 h-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95'>
                <BsCalendar size={30} className='text-white' />
              </div>
              {hoveredIcon === 'calendar' && <Tooltip text='Agende uma Chamada' />}
            </button>

            {/* Spotify */}
            <button
              onClick={handleSpotifyClick}
              onMouseEnter={() => setHoveredIcon('spotify')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-green-600 to-green-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.spotify ? 'ring-2 ring-white/50' : ''}`}>
                <BsSpotify size={35} className='text-white' />
              </div>
              {hoveredIcon === 'spotify' && <Tooltip text='Spotify' />}
            </button>

            {/* Email */}
            <button
              onClick={handleVSCodeClick}
              onMouseEnter={() => setHoveredIcon('VSCode')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className='w-12 h-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95'>
                <VscVscodeInsiders size={40} className='text-white' />
              </div>
              {hoveredIcon === 'VSCode' && <Tooltip text='Visual Studio Code' />}
            </button>

            {/* Links */}
            <button
              onClick={handleLinksClick}
              onMouseEnter={() => setHoveredIcon('links')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className='w-12 h-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95'>
                <FaLink size={30} className='text-white' />
              </div>
              {hoveredIcon === 'links' && <Tooltip text='Links de contatos' />}
              {showLinksPopup && <LinksPopup />}
            </button>

            {/* Terminal */}
            <button
              onClick={onTerminalClick}
              onMouseEnter={() => setHoveredIcon('terminal')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.terminal ? 'ring-2 ring-white/50' : ''}`}>
                <RiTerminalFill size={35} className='text-white' />
              </div>
              {hoveredIcon === 'terminal' && <Tooltip text='Terminal' />}
            </button>

            {/* Divider */}
            <div className="border-l border-gray-400 mx-2"></div>

            {/* Explorador */}
            <button
              onClick={onDeleteClick}
              onMouseEnter={() => setHoveredIcon('folder')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-white to-white/100 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.folder ? 'ring-2 ring-white/50' : ''}`}>
                <BsFillFolderFill size={35} className='text-black' />
              </div>
              {hoveredIcon === 'folder' && <Tooltip text='Finder' />}
            </button>

            {/* Excluir */}
            <button
              onClick={onDeleteClick}
              onMouseEnter={() => setHoveredIcon('delete')}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative"
            >
              <div className={`w-12 h-12 bg-gradient-to-t from-white to-white/100 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${activeApps.delete ? 'ring-2 ring-white/50' : ''}`}>
                <BsFillTrash2Fill size={35} className='text-black' />
              </div>
              {hoveredIcon === 'delete' && <Tooltip text='Excluir' />}
            </button>
          </div>
        </div>
      </div>

      <ResumeViewer isOpen={showResume} onClose={handleCloseResume} />
      <SpotifyPlayer
        isOpen={showSpotify}
        onClose={handleCloseSpotify}
        playlistId={userConfig.spotify.playlistId}
      />
    </>
  );
};

export default DesktopDock;
