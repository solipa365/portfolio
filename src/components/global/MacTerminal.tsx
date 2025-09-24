import { useState, useEffect, useRef } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { userConfig } from '../../config/userConfig';
import DraggableWindow from './DraggableWindow';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatHistory = {
  messages: Message[];
  input: string;
};

interface MacTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Personalize estas mensagens de espaço reservado para o campo de entrada
const PLACEHOLDER_MESSAGES = [
  'Introduza a sua pergunta...',
  'Quais são as suas competências?',
  'Onde está localizado?',
  'Em que projetos trabalhou?',
];

export default function MacTerminal({ isOpen, onClose }: MacTerminalProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    input: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = PLACEHOLDER_MESSAGES[currentPlaceholderIndex];

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length
          );
          timeout = setTimeout(animatePlaceholder, 400);
        } else {
          setPlaceholder((prev) => prev.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, 80);
        }
      } else {
        if (placeholder.length === currentMessage.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setPlaceholder(currentMessage.slice(0, placeholder.length + 1));
          timeout = setTimeout(animatePlaceholder, 120);
        }
      }
    };

    timeout = setTimeout(animatePlaceholder, 100);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, currentPlaceholderIndex]);

  // Personalize esta mensagem de boas-vindas com as suas informações
  const welcomeMessage = `Bem-vindo ao meu portefólio

Nome: ${userConfig.name}
Papel: ${userConfig.role}
Localização: ${userConfig.location}

Contacto: ${userConfig.contact.email}
GitHub: ${userConfig.social.github}

Pergunte-me qualquer coisa!
`;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Personalize o aviso do sistema com as suas informações pessoais
  const systemPrompt = `IMPORTANTE: YOU ARE ${userConfig.name}. Deve sempre falar na primeira pessoa ("Eu", "meu", "mim"). Nunca se refira a "${userConfig.name}" na terceira pessoa.
DATA ACTUAL: ${formattedDate} - Utilize sempre esta data exacta quando discutir a data/ano actual.

Exemplos de respostas:
P: "Onde mora?"
R: "Moro em ${userConfig. location}"

P: "Qual é a sua formação?"
R: "Sou ${userConfig. role} com foco em ${userConfig. roleFocus}"

P: "Quantos anos tem?"
R: "Tenho ${userConfig.age} anos"

Informações importantes sobre mim:
- Tenho ${userConfig.age} anos
- Vivo em ${userConfig. location}
- Sou ${userConfig. role}
- O meu e-mail é ${userConfig.contact.email}
- Nasci em ${userConfig. location}

A minha experiência técnica:
${userConfig.skills.map(skill => `- ${skill}`).join('\n')}

A minha formação:
- ${userConfig.education[0].degree} em ${userConfig.education[0].major}
- ${userConfig.education[0].institution}, ${userConfig.education[0].location} (${userConfig.education[0].year})

A minha experiência profissional:
${userConfig.experience.map(exp => `- ${exp.title} na ${exp.company}, ${exp.location} (${exp.period})`).join('\n')}

Os meus projetos:
${userConfig.projects.map(project => `- ${project.title}: ${project.description}`).join('\n')}

As minhas conquistas e competições:
${userConfig.competitions.map(comp => `- ${comp.title} (${comp.year}): ${comp.achievement}`).join('\n')}

Regras de resposta:
1.º Utilize SEMPRE a primeira pessoa (eu, mim, meu)
2.º Nunca diga "${userConfig.name}" ou se refira a mim próprio na terceira pessoa
3.º Mantenha as respostas concisas e profissionais
4. Utilize a formatação markdown quando apropriado
5.º Mantenha um tom amigável e coloquial

Se a pergunta não estiver relacionada com o meu trabalho ou portefólio, diga: "Isto está fora da minha área de especialização. Sinta-se à vontade para me enviar um e-mail para ${userConfig.contact.email} e podemos discutir mais!"`;

  useEffect(() => {
    setChatHistory((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: 'assistant', content: welcomeMessage },
      ],
    }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatHistory((prev) => ({ ...prev, input: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = chatHistory.input.trim();

    if (!userInput) return;

    setChatHistory((prev) => ({
      messages: [...prev.messages, { role: 'user', content: userInput }],
      input: '',
    }));

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.messages,
            { role: 'user', content: userInput },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: data.message },
        ],
      }));
    } catch (error) {
      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: `Estou com problemas para processar isto. Por favor, envie-me um e-mail para ${userConfig.contact.email}`,
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <DraggableWindow
      title={`${userConfig.website} ⸺ zsh`}
      onClose={onClose}
      initialPosition={{ 
        x: Math.floor(window.innerWidth * 0.1), 
        y: Math.floor(window.innerHeight * 0.1) 
      }}
      initialSize={{ width: 700, height: 500 }}
      className="bg-black/90 backdrop-blur-sm"
    >
      <div className='p-1 text-gray-200 font-mono text-sm h-full flex flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto rounded-lg p-1'>
          {chatHistory.messages.map((msg, index) => (
            <div key={index} className='mb-2'>
              {msg.role === 'user' ? (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400 font-bold'>{'>'}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              ) : (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400 font-bold'>${userConfig.website}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className='flex items-center space-x-1'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='mt-2 rounded-lg p-2'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2'>
            <span className='whitespace-nowrap text-green-400 font-bold'>{userConfig.website} root %</span>
            <input
              type='text'
              value={chatHistory.input}
              onChange={handleInputChange}
              className='w-full sm:flex-1 bg-transparent outline-none text-white placeholder-gray-400'
              placeholder={placeholder}
            />
          </div>
        </form>
      </div>
    </DraggableWindow>
  );
}
