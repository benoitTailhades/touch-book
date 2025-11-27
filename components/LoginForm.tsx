import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Focus heading on mount for accessibility
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic - in a real app this would call an API
    // We create a mock user based on the email or generic data
    const mockUser: User = {
      firstName: "Alexandre",
      lastName: "Martin",
      email: email
    };
    onLogin(mockUser);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl font-bold mb-8 text-white focus:outline-none focus:ring-4 focus:ring-braille-accent/50 rounded-lg p-1"
      >
        Connexion à votre compte
      </h2>

      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl space-y-6"
        aria-label="Formulaire de connexion"
      >
        <div>
          <label htmlFor="email" className="block text-lg font-medium mb-2 text-white">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-900 border-2 border-gray-600 text-white p-4 rounded-lg text-lg focus:border-braille-accent focus:ring-4 focus:ring-braille-accent/50 outline-none transition-all"
            required
            autoComplete="email"
            placeholder="exemple@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-lg font-medium mb-2 text-white">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-900 border-2 border-gray-600 text-white p-4 rounded-lg text-lg focus:border-braille-accent focus:ring-4 focus:ring-braille-accent/50 outline-none transition-all"
            required
            autoComplete="current-password"
          />
          <p className="mt-2 text-gray-400 text-sm" id="password-hint">
            Le mot de passe doit contenir au moins 8 caractères.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-braille-accent text-gray-900 font-bold text-lg py-4 px-6 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-transparent border-2 border-white text-white font-bold text-lg py-4 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;