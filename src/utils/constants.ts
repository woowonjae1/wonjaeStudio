import { Album } from '@/types';
import { Player } from '@/types';
import { Match } from '@/types';

export const ALBUMS: Album[] = [
    {
    id: 1,
      title: 'Romantic Album',
    image: '/image/Romantic.jpg',
      imageSrc: '/image/Romantic.jpg',
    audioSrc: '/audio/禹元宰 - 傍晚的Romantic.mp3',
    artist: '禹元宰52hz'
    },
    {
    id: 2,
      title: 'Art Life Album',
    image: '/image/Artlife.jpg',
      imageSrc: '/image/Artlife.jpg',
    audioSrc: '/audio/禹元宰 - [Free]#cant chat with you.mp3',
    artist: '禹元宰52hz'
    },
    {
    id: 3,
      title: 'Heart Breaking Album',
    image: '/image/HeartBreaking.jpg',
      imageSrc: '/image/HeartBreaking.jpg',
    audioSrc: '/audio/禹元宰 - Crush.mp3',
    artist: '禹元宰52hz'
    },
    {
    id: 4,
      title: 'Nobody Gets Me Album',
    image: '/image/nobodygetsme.jpg',
      imageSrc: '/image/nobodygetsme.jpg',
    audioSrc: '/audio/禹元宰 - Nobody Gets Me Like u R&B TYPE BEAT.mp3',
    artist: '禹元宰52hz'
  },
  {
    id: 5,
    title: 'entityLife',
    image: '/image/entityLife.jpg',
    imageSrc: '/image/entityLife.jpg',
    audioSrc: '',
    artist: '禹元宰52hz'
  },
  {
    id: 6,
    title: 'iambluegroove',
    image: '/image/iambluegroove.jpg',
    imageSrc: '/image/iambluegroove.jpg',
    audioSrc: '',
    artist: '禹元宰52hz'
  },
  {
    id: 7,
    title: 'pinkBlue',
    image: '/image/pinkBlue.jpg',
    imageSrc: '/image/pinkBlue.jpg',
    audioSrc: '',
    artist: '禹元宰52hz'
  },
  {
    id: 8,
    title: 'summer',
    image: '/image/summer.jpg',
    imageSrc: '/image/summer.jpg',
    audioSrc: '',
    artist: '禹元宰52hz'
  }
];

export const PLAYERS: Player[] = [
  // Goalkeepers
  {
    id: 1,
    name: "EDERSON",
    number: 31,
    position: "Goalkeeper",
    image: "/images/players/ederson.jpg",
    nationality: "Brazil"
  },
  {
    id: 2,
    name: "STEFAN ORTEGA",
    number: 18,
    position: "Goalkeeper",
    image: "/images/players/ortega.jpg",
    nationality: "Germany"
  },
  {
    id: 3,
    name: "SCOTT CARSON",
    number: 33,
    position: "Goalkeeper",
    image: "/images/players/carson.jpg",
    nationality: "England"
  },

  // Defenders
  {
    id: 4,
    name: "KYLE WALKER",
    number: 2,
    position: "Defender",
    image: "/images/players/walker.jpg",
    nationality: "England"
  },
  {
    id: 5,
    name: "RUBEN DIAS",
    number: 3,
    position: "Defender",
    image: "/images/players/dias.jpg",
    nationality: "Portugal"
  },
  {
    id: 6,
    name: "JOHN STONES",
    number: 5,
    position: "Defender",
    image: "/images/players/stones.jpg",
    nationality: "England"
  },
  {
    id: 7,
    name: "NATHAN AKE",
    number: 6,
    position: "Defender",
    image: "/images/players/ake.jpg",
    nationality: "Netherlands"
  },
  {
    id: 8,
    name: "JOSKO GVARDIOL",
    number: 24,
    position: "Defender",
    image: "/images/players/gvardiol.jpg",
    nationality: "Croatia"
  },

  // Midfielders
  {
    id: 9,
    name: "KEVIN DE BRUYNE",
    number: 17,
    position: "Midfielder",
    image: "/images/players/debruyne.jpg",
    nationality: "Belgium"
  },
  {
    id: 10,
    name: "RODRI",
    number: 16,
    position: "Midfielder",
    image: "/images/players/rodri.jpg",
    nationality: "Spain"
  },
  {
    id: 11,
    name: "BERNARDO SILVA",
    number: 20,
    position: "Midfielder",
    image: "/images/players/bernardo.jpg",
    nationality: "Portugal"
  },
  {
    id: 12,
    name: "PHIL FODEN",
    number: 47,
    position: "Midfielder",
    image: "/images/players/foden.jpg",
    nationality: "England"
  },
  {
    id: 13,
    name: "MATEO KOVACIC",
    number: 8,
    position: "Midfielder",
    image: "/images/players/kovacic.jpg",
    nationality: "Croatia"
  },
  {
    id: 14,
    name: "MATHEUS NUNES",
    number: 27,
    position: "Midfielder",
    image: "/images/players/nunes.jpg",
    nationality: "Portugal"
  },

  // Forwards
  {
    id: 15,
    name: "ERLING HAALAND",
    number: 9,
    position: "Forward",
    image: "/images/players/haaland.jpg",
    nationality: "Norway"
  },
  {
    id: 16,
    name: "JEREMY DOKU",
    number: 11,
    position: "Forward",
    image: "/images/players/doku.jpg",
    nationality: "Belgium"
  },
  {
    id: 17,
    name: "JACK GREALISH",
    number: 10,
    position: "Forward",
    image: "/images/players/grealish.jpg",
    nationality: "England"
  },
  {
    id: 18,
    name: "OSCAR BOBB",
    number: 52,
    position: "Forward",
    image: "/images/players/bobb.jpg",
    nationality: "Norway"
  },
  {
    id: 19,
    name: "MARLOS MORENO",
    number: 7,
    position: "Forward",
    image: "/images/players/moreno.jpg",
    nationality: "Colombia"
  }
];

export const MATCHES: Match[] = [
  {
    id: 1,
    competition: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Brentford",
    date: "2025-02-20",
    time: "20:30",
    venue: "Etihad Stadium",
    isFinished: false,
    homeTeamLogo: `https://ui-avatars.com/api/?name=Manchester+City&bold=true&background=98C5E9&color=fff`,
    awayTeamLogo: `https://ui-avatars.com/api/?name=Brentford&bold=true&background=98C5E9&color=fff`
  },
  {
    id: 2,
    competition: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Nottingham Forest",
    date: "2025-03-08",
    time: "23:00",
    venue: "Etihad Stadium",
    isFinished: false,
    homeTeamLogo: `https://ui-avatars.com/api/?name=Manchester+City&bold=true&background=98C5E9&color=fff`,
    awayTeamLogo: `https://ui-avatars.com/api/?name=Nottingham+Forest&bold=true&background=98C5E9&color=fff`
  },
  {
    id: 3,
    competition: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Chelsea",
    date: "2025-02-17",
    time: "18:30",
    venue: "Etihad Stadium",
    isFinished: true,
    homeScore: 1,
    awayScore: 1,
    homeTeamLogo: `https://ui-avatars.com/api/?name=Manchester+City&bold=true&background=98C5E9&color=fff`,
    awayTeamLogo: `https://ui-avatars.com/api/?name=Chelsea&bold=true&background=98C5E9&color=fff`
  },
  // 可以添加更多比赛...
  ];