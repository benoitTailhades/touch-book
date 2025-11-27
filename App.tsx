import React, { useState, useEffect, useRef } from 'react';
import { Book as BookIcon, Download, RefreshCw, BookOpen, Search, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { Book, AppStatus, User, ViewState } from './types';
import { fetchBookRecommendations, simulateBrailleConversion } from './services/geminiService';
import SkipLink from './components/SkipLink';
import LiveAnnouncer from './components/LiveAnnouncer';
import LoginForm from './components/LoginForm';
import ProfileView from './components/ProfileView';

const GENRES = [
  "Roman",
  "Science-Fiction",
  "Histoire",
  "Biographies",
  "Jeunesse",
  "Policier"
];

const App: React.FC = () => {
  // Application Data State
  const [books, setBooks] = useState<Book[]>([]);
  const [downloadedBooks, setDownloadedBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedGenre, setSelectedGenre] = useState<string>('Roman');
  const [announcement, setAnnouncement] = useState<string>('');
  
  // Authentication & Navigation State
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');

  // Refs for focus management
  const bookListRef = useRef<HTMLHeadingElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  // Initial load
  useEffect(() => {
    loadBooks(selectedGenre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBooks = async (genre: string) => {
    setStatus(AppStatus.LOADING);
    setAnnouncement(`Recherche de livres dans la catégorie ${genre} en cours, veuillez patienter.`);
    try {
      const results = await fetchBookRecommendations(genre);
      setBooks(results);
      setStatus(AppStatus.SUCCESS);
      setAnnouncement(`${results.length} livres trouvés dans la catégorie ${genre}.`);
      
      // Move focus to list title after loading if we are on home view
      if (currentView === 'HOME') {
        setTimeout(() => {
          if (bookListRef.current) {
            bookListRef.current.focus();
          }
        }, 100);
      }

    } catch (e) {
      setStatus(AppStatus.ERROR);
      setAnnouncement("Erreur lors du chargement des livres. Veuillez réessayer.");
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGenre = e.target.value;
    setSelectedGenre(newGenre);
    loadBooks(newGenre);
  };

  const handleDownload = async (book: Book) => {
    if (!user) {
      setAnnouncement("Vous devez être connecté pour télécharger un livre.");
      setCurrentView('LOGIN');
      return;
    }

    setAnnouncement(`Préparation du livre ${book.title} pour votre liseuse braille.`);
    
    // Simulate download process
    const success = await simulateBrailleConversion(book.title);
    
    if (success) {
      setDownloadedBooks(prev => [book, ...prev]);
      setAnnouncement(`Succès ! Le livre ${book.title} a été envoyé à votre liseuse et ajouté à votre profil.`);
      // alert is intrusive for some screen readers, relying on LiveAnnouncer is better, 
      // but keeping alert as a fallback for visual confirmation if needed, 
      // though removing it for smoother AX is often preferred. 
      // I'll stick to visual confirmation via UI or just the announcement.
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('HOME'); // Go back to home or profile? Let's go Home to browse.
    setAnnouncement(`Bienvenue, ${loggedInUser.firstName}. Vous êtes maintenant connecté.`);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('HOME');
    setAnnouncement("Vous avez été déconnecté.");
  };

  // View Navigation Helpers
  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    // Announcement handled by the component mount focus usually, but we can announce transition
    if (view === 'LOGIN') setAnnouncement("Chargement de la page de connexion.");
    if (view === 'PROFILE') setAnnouncement("Chargement de votre profil.");
    if (view === 'HOME') setAnnouncement("Retour à l'accueil.");
  };

  return (
    <div className="min-h-screen bg-braille-dark text-white font-sans selection:bg-braille-accent selection:text-black">
      <SkipLink />
      <LiveAnnouncer message={announcement} />

      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900 sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button 
              onClick={() => navigateTo('HOME')}
              className="flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-braille-accent/50 rounded-lg p-1"
              aria-label="Touch Book - Retour à l'accueil"
            >
              <BookIcon className="w-8 h-8 md:w-10 md:h-10 text-braille-accent" aria-hidden="true" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
                Touch <span className="text-braille-accent">Book</span>
              </h1>
            </button>
            
            {/* Mobile Menu Button could go here, but for simplicity sticking to visible links */}
          </div>

          <nav aria-label="Menu principal" className="w-full md:w-auto">
            <ul className="flex justify-center md:justify-end gap-3 flex-wrap">
              {currentView === 'HOME' && (
                <li>
                  <button 
                    onClick={() => loadBooks(selectedGenre)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border-2 border-transparent focus:border-braille-accent rounded-lg transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-braille-accent/50"
                  >
                    <RefreshCw className="w-5 h-5" aria-hidden="true" />
                    Actualiser
                  </button>
                </li>
              )}
              
              {user ? (
                <>
                  <li>
                    <button
                      onClick={() => navigateTo('PROFILE')}
                      className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-braille-accent/50 ${currentView === 'PROFILE' ? 'bg-braille-accent text-gray-900 border-braille-accent' : 'bg-gray-800 hover:bg-gray-700 border-transparent'}`}
                      aria-current={currentView === 'PROFILE' ? 'page' : undefined}
                    >
                      <UserIcon className="w-5 h-5" aria-hidden="true" />
                      Mon Profil
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border-2 border-transparent hover:border-red-500 rounded-lg transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-red-500/50"
                      aria-label="Se déconnecter"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                      <span className="sr-only md:not-sr-only">Déconnexion</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => navigateTo('LOGIN')}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-colors font-medium focus:outline-none focus:ring-4 focus:ring-braille-accent/50 ${currentView === 'LOGIN' ? 'bg-braille-accent text-gray-900 border-braille-accent' : 'bg-gray-800 hover:bg-gray-700 border-transparent'}`}
                    aria-current={currentView === 'LOGIN' ? 'page' : undefined}
                  >
                    <LogIn className="w-5 h-5" aria-hidden="true" />
                    Se connecter
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main 
        id="main-content" 
        ref={mainContentRef}
        className="container mx-auto px-4 py-8 focus:outline-none"
        tabIndex={-1}
      >
        {currentView === 'LOGIN' && (
          <LoginForm 
            onLogin={handleLogin} 
            onCancel={() => navigateTo('HOME')} 
          />
        )}

        {currentView === 'PROFILE' && user && (
          <ProfileView 
            user={user} 
            downloadedBooks={downloadedBooks}
            onBackToCatalog={() => navigateTo('HOME')}
          />
        )}

        {currentView === 'HOME' && (
          <>
            {/* Controls Section */}
            <section 
              className="mb-10 bg-gray-800 p-6 rounded-xl border border-gray-700"
              aria-labelledby="filter-heading"
            >
              <h2 id="filter-heading" className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <Search className="w-6 h-6 text-braille-accent" aria-hidden="true" />
                Choisir un genre littéraire
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="w-full sm:w-auto flex-grow max-w-md">
                  <label htmlFor="genre-select" className="block text-lg mb-2 font-medium text-gray-200">
                    Catégorie de livres
                  </label>
                  <select
                    id="genre-select"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    className="w-full bg-gray-900 border-2 border-gray-600 text-white rounded-lg px-4 py-3 text-lg focus:border-braille-accent focus:ring-4 focus:ring-braille-accent/50 outline-none transition-all cursor-pointer"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Content Area */}
            {status === AppStatus.LOADING ? (
              <div className="flex flex-col items-center justify-center py-20" role="status">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-braille-accent mb-4"></div>
                <p className="text-xl font-medium animate-pulse">Consultation du catalogue...</p>
              </div>
            ) : status === AppStatus.ERROR ? (
              <div className="bg-red-900/50 border-2 border-red-500 p-6 rounded-xl text-center" role="alert">
                <p className="text-xl font-bold mb-2">Une erreur est survenue.</p>
                <p>Impossible de charger les suggestions pour le moment. Vérifiez votre connexion.</p>
                <button 
                  onClick={() => loadBooks(selectedGenre)}
                  className="mt-4 bg-white text-red-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 focus:ring-4 focus:ring-white"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <section aria-labelledby="results-heading">
                <h2 
                  id="results-heading" 
                  className="text-2xl font-bold mb-6 sr-only focus:not-sr-only focus:outline-none focus:text-braille-accent focus:underline"
                  tabIndex={-1}
                  ref={bookListRef}
                >
                  Résultats pour {selectedGenre}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {books.map((book) => (
                    <article 
                      key={book.id}
                      className="bg-gray-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-600 focus-within:border-braille-accent focus-within:ring-4 focus-within:ring-braille-accent/30 transition-all flex flex-col h-full shadow-lg"
                    >
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <span className="inline-block bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold text-braille-accent">
                            {book.genre}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-400" title="Format Braille estimé">
                            <BookOpen className="w-4 h-4" aria-hidden="true" />
                            {book.brailleSize}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-lg text-gray-300 font-medium mb-4">
                          par {book.author}
                        </p>
                        
                        <div className="mb-6 text-gray-400 leading-relaxed flex-grow">
                          {book.description}
                        </div>

                        <button
                          onClick={() => handleDownload(book)}
                          className={`w-full mt-auto font-bold text-lg py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 ${
                            downloadedBooks.some(b => b.id === book.id)
                              ? 'bg-green-600 text-white cursor-default'
                              : 'bg-braille-accent text-gray-900 hover:bg-yellow-300'
                          }`}
                          aria-label={
                             downloadedBooks.some(b => b.id === book.id) 
                             ? `${book.title} déjà téléchargé` 
                             : `Télécharger ${book.title} de ${book.author} sur la liseuse`
                          }
                          disabled={downloadedBooks.some(b => b.id === book.id)}
                        >
                          {downloadedBooks.some(b => b.id === book.id) ? (
                            <>
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              Sur la liseuse
                            </>
                          ) : (
                            <>
                              <Download className="w-6 h-6" aria-hidden="true" />
                              Envoyer vers la liseuse
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-900 border-t border-gray-700 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="mb-2">Touch Book - Accessibilité avant tout.</p>
          <p className="text-sm">Optimisé pour lecteurs d'écran NVDA, JAWS et VoiceOver.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;