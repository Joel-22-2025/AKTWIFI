import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../service/firebase";
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
    const [formdata, setFormdata] = useState({ nom: '', prenom: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormdata({ ...formdata, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, formdata.email, formdata.password);
            await setDoc(doc(db, "users", user.uid), {
                nom: formdata.nom,
                prenom: formdata.prenom,
                email: formdata.email,
                role: "admin",
                createdAt: serverTimestamp()
            });
            await Swal.fire({ title: "Compte créé !", icon: "success", timer: 2000, showConfirmButton: false });
            navigate('/login');
        } catch (err) {
            const msgs = {
                'auth/email-already-in-use': 'Cet email est déjà utilisé.',
                'auth/weak-password': 'Mot de passe trop faible (6 car. min).',
                'auth/invalid-email': 'Adresse email invalide.',
            };
            setError(msgs[err.code] || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                {/* Brand centré */}
                <div className="flex flex-col items-center gap-2 mb-4 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                        📡
                    </div>
                    <p className="text-gray-900 font-bold text-lg leading-none">AKT WiFi</p>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Dashboard Admin</p>
                </div>

                {/* Badge */}
                <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 mx-auto w-fit mb-5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">Abonnement Actif</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Créer un compte</h1>
                <p className="text-gray-500 text-sm text-center mb-6">Inscription administrateur</p>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                        <span>⚠️</span><span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">

                    {/* Nom + Prénom côte à côte */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nom</label>
                            <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 text-gray-800 placeholder-slate-400 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Prénom</label>
                            <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 text-gray-800 placeholder-slate-400 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">✉️</span>
                            <input type="email" name="email" placeholder="admin@aktwifi.com" onChange={handleChange} required
                                className="w-full bg-slate-50 border border-slate-200 text-gray-800 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mot de passe</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••"
                                onChange={handleChange} required autoComplete="new-password"
                                className="w-full bg-slate-50 border border-slate-200 text-gray-800 placeholder-slate-400 rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm">
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-200 mt-1">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Inscription...
                            </span>
                        ) : "S'inscrire →"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-slate-400 text-xs uppercase tracking-widest">AKT WiFi</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                <p className="text-center text-sm text-slate-500">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition">Se connecter</Link>
                </p>

                <div className="flex items-center justify-center gap-2 mt-5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-slate-400 text-xs">Connexion sécurisée</span>
                </div>

            </div>
        </div>
    );
};

export default Signup;