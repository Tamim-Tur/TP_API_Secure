require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Destination = require('../src/models/Destination');
const Reservation = require('../src/models/Reservation');

async function seedDatabase() {
  try {
    console.log('Démarrage du seed...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' MongoDB connecté');

    // Nettoyer
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Reservation.deleteMany({});

    // Utilisateurs
    const admin = await User.create({
      email: 'admin@voyages.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'System',
      role: 'ADMIN'
    });

    const user = await User.create({
      email: 'user@voyages.com',
      password: 'user123',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'USER'
    });

    console.log(' Utilisateurs créés');

    // Destinations
    const destinations = await Destination.create([
      {
        name: 'Paris Romance',
        description: 'Week-end romantique à Paris avec visite de la Tour Eiffel',
        country: 'France',
        city: 'Paris',
        price: 1200,
        duration: 3,
        available: true,
        features: ['Tour Eiffel', 'Croisière Seine', 'Musée du Louvre'],
        maxTravelers: 8
      },
      {
        name: 'Bali Paradis',
        description: 'Séjour détente à Bali avec plages et temples',
        country: 'Indonésie',
        city: 'Denpasar',
        price: 1500,
        duration: 7,
        available: true,
        features: ['Plages de sable blanc', 'Temples balinais', 'Spa'],
        maxTravelers: 6
      },
      {
        name: 'New York Adventure',
        description: 'Découverte de la ville qui ne dort jamais',
        country: 'USA',
        city: 'New York',
        price: 1800,
        duration: 5,
        available: true,
        features: ['Statue de la Liberté', 'Central Park', 'Broadway'],
        maxTravelers: 10
      }
    ]);

    console.log('  Destinations créées');

    // Réservations
    await Reservation.create({
      user: user._id,
      destination: destinations[0]._id,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-04'),
      travelers: 2,
      totalPrice: 2400,
      status: 'CONFIRMED',
      specialRequests: 'Chambre avec vue si possible'
    });

    console.log(' Réservations créées');
    console.log('');
    console.log(' SEED TERMINÉ AVEC SUCCÈS !');
    console.log('');
    console.log(' COMPTES DE TEST :');
    console.log('   Admin: admin@voyages.com / admin123');
    console.log('   User:  user@voyages.com / user123');
    console.log('');
    console.log('🌐 URL API: http://localhost:3000');

  } catch (error) {
    console.error(' Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

if (require.main === module) {
  seedDatabase();
}