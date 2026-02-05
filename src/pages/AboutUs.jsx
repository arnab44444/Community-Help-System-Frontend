const AboutUs = () => {
    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Community Help Exchange
            </h1>
            <div className="max-w-3xl mx-auto space-y-6 text-lg text-base-content/80 leading-relaxed">
                <p>
                    Community Help Exchange is a non-profit platform designed to foster a culture of service and mutual aid within local communities. Our mission is to connect individuals who need support with those who are willing to offer their time and skills.
                </p>
                <p>
                    We believe that every person has something valuable to contribute, and that community resilience is built through these small, direct acts of kindness. By removing money from the equation, we emphasize the inherent value of human connection and time.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="card bg-base-100 shadow-xl p-6 border-l-4 border-primary">
                        <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                        <p className="text-sm">A world where no person feels alone in their time of need, and where 'time' is the most respected currency.</p>
                    </div>
                    <div className="card bg-base-100 shadow-xl p-6 border-l-4 border-secondary">
                        <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                        <p className="text-sm">To provide a secure, transparent, and easy-to-use platform that facilitates help exchanges at the grassroots level.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
