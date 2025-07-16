import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MentionsLegales() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Bouton retour */}
                    <div className="mb-8">
                        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-[#f97316] hover:text-[#ea6a0a]">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Retour à l&apos;accueil
                        </Link>
                    </div>


                    <Card className="mb-8 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl font-medium">🧾 Mentions Légales – La Pince</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="">
                                <div className="p-6 space-y-8">
                                    {/* Éditeur du site */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">1. 🧑‍💻 Éditeur du site</h2>
                                        <p>
                                            Ce site a été développé par une équipe d&apos;étudiants de la promo Naga motivés (et un peu
                                            fatigués), dans le cadre d’un projet pédagogique.
                                            On n’a pas (encore) de locaux, de SIRET, ni de comité de direction, mais on
                                            a du cœur.
                                        </p>
                                        <ul className="list-disc pl-6 mb-4">
                                            <li><span className="font-bold">Nom :</span> La Pince 🦀</li>
                                            <li><span className="font-bold">Contact :</span> Voir section 10</li>
                                            <li><span className="font-bold">Statut :</span> Projet étudiant non commercial</li>
                                            <li><span className="font-bold">Responsable de publication :</span> Le groupe projet (Amaël, Médérick, Guillaume)
                                            </li>
                                        </ul>
                                    </section>

                                    {/* Hébergement */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">2. 🏢 Hébergement</h2>
                                        <p>
                                            Ce site est hébergé par nos meilleurs amis : les serveurs cloud.
                                        </p>
                                        <ul className={`list-disc pl-6 mb-4`}>
                                            <li><strong>Hébergeur :</strong> Vercel Inc.</li>
                                            <li>340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                                            <li><Link className={"underline hover:text-primary"} href="https://vercel.com" target="_blank"
                                                      rel="noopener noreferrer">https://vercel.com</Link></li>
                                        </ul>
                                    </section>

                                    {/* Propriété intellectuelle */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">3. © Propriété
                                            intellectuelle</h2>
                                        <p>
                                            Le contenu de ce site (textes, images, code, et blagues incluses) est notre
                                            œuvre originale.
                                        </p>
                                        <p>
                                            Les icônes utilisées proviennent de la fabuleuse librairie <strong>Lucide
                                            React</strong>, qu&apos;on remercie pour leur bon goût graphique : {' '}
                                            <Link href="https://lucide.dev" target="_blank"
                                                  rel="noopener noreferrer" className={"underline hover:text-primary"}>
                                                lucide.dev
                                            </Link>
                                        </p>
                                        <p>
                                            Reproduction, même partielle, interdite sauf accord express... ou si tu veux
                                            juste t’inspirer pour ton propre projet d’école (on te jugera pas trop).
                                        </p>
                                    </section>

                                    {/* Données personnelles */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">4. 👤 Données
                                            personnelles</h2>
                                        <p>
                                            On respecte ta vie privée. On ne collecte que le strict nécessaire (email et
                                            mot de passe hashé — on n&apos;est pas des barbares).
                                        </p>
                                        <p>
                                            Tes données sont stockées de manière sécurisée et ne seront jamais revendues
                                            (déjà, on n’en aurait pas le droit, et en plus, personne ne les achèterait).
                                        </p>
                                        <p>
                                            Ce site n’a pas encore de DPO, mais on reste dispo en cas de question.
                                        </p>
                                    </section>

                                    {/* Cookies */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">5. 🍪 Cookies</h2>
                                        <p>
                                            Non, pas ceux avec des pépites. On utilise des cookies pour la session
                                            utilisateur, uniquement pour te connecter proprement.
                                        </p>
                                        <p>
                                            Aucun suivi pub, pas de mouchards, ni d’analyse comportementale ici. On
                                            garde juste ce qu’il faut pour que ça marche bien.
                                        </p>
                                    </section>

                                    {/* Limitation de responsabilité */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">6. ⚠️ Limitation de
                                            responsabilité</h2>
                                        <ul className="list-disc pl-6 mb-4">
                                            <li>Ce site est en développement constant (et parfois en crise d’identité
                                                technique).
                                            </li>
                                            <li>On ne garantit pas l’absence de bugs... mais on promet qu’on fera de
                                                notre mieux.
                                            </li>
                                            <li>Utilisation à vos risques et périls, surtout si vous tapez un mot de
                                                passe trop simple.
                                            </li>
                                        </ul>
                                    </section>

                                    {/* Liens hypertextes */}
                                    <section>
                                        <h2 className="text-xl font-semibold  mb-4">7. 🔗 Liens
                                            hypertextes</h2>
                                        <p>
                                            Des liens vers d’autres sites peuvent exister. On ne contrôle pas ces sites
                                            (on n’a même pas le temps de finir le nôtre).
                                            Si vous y trouvez des bêtises, ce n’est pas de notre faute !
                                        </p>
                                    </section>

                                    {/* Droit applicable et juridiction compétente */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">
                                            8. ⚖️  Droit applicable et juridiction compétente
                                        </h2>
                                        <p>
                                            Ce site est régi par le droit français. Toute contestation sera tranchée par
                                            un professeur, un jury ou peut-être un correcteur externe.
                                        </p>
                                        <p>
                                            Pas de procès, on est gentils.
                                        </p>
                                    </section>

                                    {/* Contact */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">9. 📬 Contact</h2>
                                        <p>
                                            Tu veux nous féliciter, poser une question ou signaler une faute
                                            d’orthographe ?
                                        </p>
                                        <ul className={`list-disc pl-6 mb-4`}>
                                            <li><strong>Email :</strong> <a
                                                href="mailto:contact@la-pince.tech">contact@la-pince.tech</a></li>
                                            <li><strong>GitHub :</strong> Si tu trouves notre dépôt, félicitations ! On
                                                n’est pas cachés, mais presque.
                                            </li>
                                        </ul>
                                    </section>

                                    {/* Date de mise à jour */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">10. 📅 Date de mise à jour</h2>
                                        <p>
                                            Ces mentions légales ont été rédigées à la sueur du clavier, le <strong>3
                                            juin 2025</strong>. Et on en est pas peu fiers.
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>

        </div>
    )
}
