import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../service/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            const msgs = {
                'auth/user-not-found':     'Aucun compte trouvé avec cet email.',
                'auth/wrong-password':     'Mot de passe incorrect.',
                'auth/invalid-email':      'Adresse email invalide.',
                'auth/too-many-requests':  'Trop de tentatives. Réessayez plus tard.',
                'auth/invalid-credential': 'Email ou mot de passe incorrect.',
            };
            setError(msgs[err.code] || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                {/* Brand */}
                <div className="flex flex-col items-center gap-2 mb-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                        📡
                    </div>
                    <div>
                        <p className="text-gray-900 font-bold text-lg leading-none">AKT WiFi</p>
                        <p className="text-gray-400 text-xs uppercase tracking-widest mt-0.5">Dashboard Admin</p>
                    </div>
                </div>

                {/* Badge abonnement */}
                <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 mx-auto w-fit mb-6">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">Abonnement Actif</span>
                </div>

                {/* Titre */}
                <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Bon retour 👋</h1>
                <p className="text-gray-500 text-sm mb-6 text-center">Connectez-vous pour accéder au dashboard</p>

                {/* Erreur */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Adresse email
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">✉️</span>
                            <input
                                type="email"
                                placeholder="admin@aktwifi.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full bg-slate-50 border border-slate-200 text-gray-800 placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full bg-slate-50 border border-slate-200 text-gray-800 placeholder-slate-400 rounded-xl pl-10 pr-12 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Bouton submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-blue-200 mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Connexion...
                            </span>
                        ) : (
                            'Se connecter →'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-slate-400 text-xs uppercase tracking-widest">AKT WiFi</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500">
                    Pas encore de compte ?{' '}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition">
                        Créer un compte
                    </Link>
                </p>

               

            </div>
        </div>
    );
};

export default Login;