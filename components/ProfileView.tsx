import React, { useRef, useEffect } from 'react';
import { User, Book } from '../types';
import { BookOpen, User as UserIcon } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  downloadedBooks: Book[];
  onBackToCatalog: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, downloadedBooks, onBackToCatalog }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section 
        className="bg-gray-800 p-8 rounded-xl border-l-8 border-braille-accent shadow-lg"
        aria-labelledby="profile-heading"
      >
        <div className="flex items-start gap-4">
          <div className="bg-gray-700 p-4 rounded-full hidden sm:block">
            <UserIcon className="w-8 h-8 text-braille-accent" aria-hidden="true" />
          </div>
          <div>
            <h2 
              id="profile-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-bold text-white mb-2 focus:outline-none focus:ring-4 focus:ring-braille-accent/50 rounded-lg"
            >
              Mon Profil
            </h2>
            <div className="text-xl space-y-1 text-gray-300">
              <p><span className="font-semibold text-gray-400">Prénom :</span> {user.firstName}</p>
              <p><span className="font-semibold text-gray-400">Nom :</span> {user.lastName}</p>
              <p><span className="font-semibold text-gray-400">Email :</span> {user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="downloads-heading">
        <h3 
          id="downloads-heading" 
          className="text-2xl font-bold mb-6 flex items-center gap-2"
        >
          <BookOpen className="w-6 h-6 text-braille-accent" aria-hidden="true" />
          Livres téléchargés sur la liseuse ({downloadedBooks.length})
        </h3>

        {downloadedBooks.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-xl border border-dashed border-gray-600 text-center">
            <p className="text-xl mb-6">Vous n'avez pas encore téléchargé de livres.</p>
            <button
              onClick={onBackToCatalog}
              className="bg-braille-accent text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-white transition-colors"
            >
              Parcourir le catalogue
            </button>
          </div>
        ) : (
          <ul className="space-y-4" role="list">
            {downloadedBooks.map((book, index) => (
              <li 
                key={`${book.id}-${index}`}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-750 transition-colors"
              >
                <div>
                  <h4 className="text-xl font-bold text-braille-accent mb-1">{book.title}</h4>
                  <p className="text-gray-300">par {book.author}</p>
                  <p className="text-sm text-gray-500 mt-2">{book.brailleSize}</p>
                </div>
                <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg border border-green-900/50 text-sm font-semibold flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Transféré
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfileView;