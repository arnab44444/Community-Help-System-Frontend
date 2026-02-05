const Motivation = () => {
    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Our Motivation
            </h1>
            <div className="max-w-4xl mx-auto">
                <div className="hero bg-base-200 rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="hero-content text-center p-12">
                        <div className="max-w-md">
                            <h2 className="text-3xl font-bold mb-4 italic">"The best way to find yourself is to lose yourself in the service of others."</h2>
                            <p className="opacity-70">— Mahatma Gandhi</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-4">
                        <div className="text-5xl">❤️</div>
                        <h3 className="text-xl font-bold">Empathy First</h3>
                        <p className="text-base-content/70">We are motivated by the desire to build a more empathetic society where helping a neighbor is a natural reflex.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl">🕒</div>
                        <h3 className="text-xl font-bold">Time Equality</h3>
                        <p className="text-base-content/70">Everyone has 24 hours in a day. We believe an hour of companionship is as valuable as an hour of technical repair.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl">🏗️</div>
                        <h3 className="text-xl font-bold">Local Resilience</h3>
                        <p className="text-base-content/70">Strengthening local bonds makes communities more resilient during emergencies and social isolation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Motivation;
