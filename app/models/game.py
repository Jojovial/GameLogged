from .db import db, environment, SCHEMA, add_prefix_for_prod
from enum import Enum

class System(Enum):
    _32X = "32X"
    _3DO = "3DO"
    ACORN_ARCHIMEDES = "Acorn Archimedes"
    ACORN_ELECTRON = "Acorn Electron"
    ACTION_MAX = 'Action Max'
    AMAZON_LUNA = 'Amazon Luna'
    AMIGA = 'Amiga'
    AMIGA_CD32 = 'Amiga CD32'
    AMSTRAD_CPC = 'Amstrad CPC'
    AMSTRAD_GX4000 = 'Amstrad GX4000'
    ANDROID = 'Android'
    APF_M1000 = 'APF-M1000'
    APPLE_II = 'Apple II'
    APPLE_ARCADE = 'Apple Arcade'
    APPLE_BANDAI_PIPPIN = 'Apple Bandai Pippin'
    ARCADE = 'Arcade'
    ARDUBOY = 'Arduboy'
    ATARI_2600 = 'Atarai 2600'
    ATARI_5200 = 'Atari 5200'
    ATARI_7800 = 'Atari 7800'
    ATARI_ST = 'Atari ST'
    BALLY_ASTROCADE = 'Bally Astrocade'
    BATTLE_NET = 'Battle.net'
    BBC_MICRO = 'BBC Micro'
    BEAMDOG = 'Beamdog'
    BETHESDA_LAUNCHER = 'Bethesda Launcher'
    BIG_FISH_GAMES = 'Big Fish Games'
    BLACKNUT = 'Blacknut'
    BROWSER = 'Browser'
    CASIO_LOOPY = 'Casio Loopy'
    CASIO_PV_1000 = 'Casio PV-1000'
    CALCULATOR = 'Calculator'
    CD_I = 'CD-i'
    CD32X = 'CD32X'
    COLECO_ADAM = 'Coleco Adam'
    COLECOVISION = 'ColecoVision'
    COMMODORE_64 = 'Commodore 64'
    COMMODORE_CDTV = 'Commodore CDTV'
    COMMODORE_PLUS4 = 'Commodore Plus/4'
    COMMODORE_VIC_20 = 'Commodore VIC-20'
    COUGAR_BOY = 'Cougar Boy'
    DESURA = 'Desura'
    DISCORD = 'Discord'
    DOS = 'DOS'
    DOTEMU = 'DotEmu'
    DRAGON_32_64 = 'Dragon 32/64'
    DREAMCAST = 'Dreamcast'
    DSIWARE = 'DSiWare'
    EA_ACCESS = 'Ea Access'
    EMERSON_ARCADIA_2001 = 'Emerson Arcadia 2001'
    ENTEX_ADVENTURE_VISION = 'Entex Adventure Vision'
    EPIC_GAMES_LAUNCHER = 'Epic Games Launcher'
    EPOCH_SUPER_CASSETTE_VISION = 'Epoch Super Cassette Vision'
    EVERCADE = 'Evercade'
    FAIRCHILD_CHANNEL_F = 'Fairchild Channel F'
    FAMILY_COMPUTER = 'Family Computer'
    FAMICOM_DISK_SYSTEM = 'Famicom Disk System'
    FM_TOWNS = 'FM Towns'
    FUJITSU_MICRO7 = 'Fujitsu Micro 7'
    GAMATE = 'Gamate'
    GAME_AND_WATCH = 'Game & Watch'
    GAME_GEAR = 'Game Gear'
    GAME_BOY = 'Game Boy'
    GAME_BOY_COLOR = 'Game Boy/Color'
    GAME_BODY_ADVANCE = 'Game Body Advance'
    E_READER = 'e-Reader'
    GAME_WAVE_FAMILY_ENTERTAINMENT_SYSTEM = 'Game Wave Family Entertainment System'
    GAMECUBE = 'GameCube'
    GAMEFLY = 'GameFly'
    GAMERSGATE = 'GamersGate'
    GAMESTOP_PC = 'GameStop PC'
    GAMES_FOR_WINDOWS = 'Games For Windows'
    GAME_COM = 'Game.com'
    GENESIS_MEGA_DRIVE = 'Genesis / Mega Drive'
    GETGAMES = 'GetGames'
    GIZMONDO = 'Gizmondo'
    GOG_COM = 'GOG.com'
    GOOGLE_STADIA = 'Google Stadia'
    GP2X_WIZ = 'GP2x Wiz'
    GREEN_MAN_GAMING = 'Green Man Gaming'
    HTC_VIVE = 'HTC Vive'
    HUMBLE_BUNDLE_STORE = 'Humble Bundle Store'
    HYPERSCAN = 'HyperScan'
    INDIECITY = 'IndieCity'
    INDIEGALA = 'IndieGala'
    INTELLIVISION = 'Intellivision'
    INTELLIVISION_AMICO = 'Intellivision Amico'
    IOS = 'iOS'
    IPAD = 'iPad'
    IPOD = 'iPod'
    IPHONE = 'iPhone'
    IQUE_PLAYER = 'iQue Player'
    ITCH_IO = 'itch.io'
    JAGUAR = 'Jaguar'
    JAGUAR_CD = 'Jaguar CD'
    LASERACTIVE = 'LaserActive'
    LINUX = 'Linux'
    LYNX = 'Lynx'
    MAC = 'Mac'
    MAGNAVOX_ODYSSEY = 'Magnavox Odyssey'
    MASTER_SYSTEM = 'Master System'
    MICROVISION = 'Microvision'
    MISCELLANEOUS = 'Miscellaneous'
    MOBILE = 'Mobile'
    MSX = 'MSX'
    N_GAGE = 'N-Gage'
    NEC_PC_6001 = 'NEC PC-6001'
    NEC_PC_6601 = 'NEC PC-6601'
    NEC_PC_8001 = 'NEC PC-8001'
    NEC_PC_8801 = 'NEC PC-8801'
    NEC_PC_9801 = 'NEC PC-9801'
    NEO_GEO = 'Neo Geo'
    NEO_GEO_CD = 'Neo Geo CD'
    NEO_GEO_POCKET_COLOR = 'Neo Geo Pocket/Color'
    NINTENDO_3DS = 'Nintendo 3DS'
    _3DS_DOWNLOADS = '3DS Downloads'
    NINTENDO_DS = 'Nintendo DS'
    NINTENDO_64 = 'Nintendo 64'
    NINTENDO_64DD = 'Nintendo 64DD'
    NINTENDO_ENTERTAINMENT_SYSTEM = 'Nintendo Entertainment System'
    NINTENDO_SWITCH = 'Nintendo Switch'
    SWITCH_DOWNLOADS = 'Switch Downloads'
    NUON = 'Nuon'
    NUUVEM = 'Nuuvem'
    OCULUS_STORE = 'Oculus Store'
    ODYSSEY2_VIDEOPAC = 'Odyssey2 / Videopac'
    ONLIVE = 'OnLive'
    ORIGIN = 'Origin'
    OUYA = 'OUYA'
    PANDORA = 'Pandora'
    PC = 'PC'
    PICO_8 = 'PICO-8'
    PINBALL = 'Pinball'
    PLATO = 'Plato'
    PLAYDATE = 'Playdate'
    PLAYDIA = 'Playdia'
    PLAYSTATION = 'PlayStation'
    PLAYSTATION_2 = 'PlayStation 2'
    PLAYSTATION_3 = 'PlayStation 3'
    PLAYSTATION_4 = 'PlayStation 4'
    PLAYSTATION_5 = 'PlayStation 5'
    PLAYSTATION_MOBILE = 'PlayStation Mobile'
    PLAYSTATION_NETWORK = 'PlayStation Network'
    PLAYSTATION_NOW = 'PlayStation Now'
    PSONE_CLASSICS = 'PSOne Classics'
    PS2_CLASSICS = 'PS2 Classics'
    PLAYSTATION_MINIS = 'PlayStation minis'
    PLAYSTATION_PORTABLE = 'PlayStation Portable'
    PLAYSTATION_VITA = 'PlayStation Vita'
    PLAYSTATION_VR = 'PlayStation VR'
    PLAYSTATION_VR2 = 'PlayStation VR2'
    PLUG_AND_PLAY = 'Plug-and-Play'
    POCKETSTATION = 'PocketStation'
    POKEMON_MINI = 'Pokémon Mini'
    R_ZONE = 'R-Zone'
    RCA_STUDIO_II = 'RCA Studio II'
    ROCKSTAR_GAMES_LAUNCHER = 'Rockstar Games Launcher'
    SUPER_A_CAN = 'Super A"Can'
    SAM_COUPE = 'SAM Coupé'
    SATURN = 'Saturn'
    SEGA_CD = 'Sega CD'
    SEGA_PICO = 'Sega Pico'
    SEGA_SG_1000 = 'Sega SG-1000'
    SHARP_MZ_1500 = 'SHARP MZ-1500'
    SHARP_X1 = 'Sharp X1'
    SHARP_X68000 = 'Sharp X68000'
    STARPATH_SUPERCHARGER = 'Starpath Supercharger'
    STEAM = 'Steam'
    SUPER_NINTENDO_ENTERTAINMENT_SYSTEM = 'Super Nintendo Entertainment System'
    SUPERGRAFX = 'SuperGrafx'
    TAPWAVE_ZODIAC = 'Tapwave Zodiac'
    THOMSON_MO5 = 'Thomas MO5'
    TI_99_4A = 'TI-99/4A'
    TIGER_HANDHELDS = 'Tiger Handhelds'
    TURBODUO = 'TurboDuo'
    TURBOGRAFX_16 = 'TurboGrafx-16'
    TURBOGRAFX_CD = 'TurboGrafx-CD'
    TRS_80_COLOR_COMPUTER = 'TRS-80 Color Computer'
    PRIME_GAMING = 'Prime Gaming'
    UPLAY = 'Uplay'
    VECTREX = 'Vectrex'
    VIRTUAL_BOY = 'Virtual Boy'
    VIRTUAL_CONSOLE_WII = 'Virtual Console (Wii)'
    VIRTUAL_CONSOLE_3DS = 'Virtual Console (3DS)'
    WASM_4 = 'WASM-4'
    WATARA_SUPERVISION = 'Watara Supervision'
    WII = 'Wii'
    WIIWARE = 'WiiWare'
    WII_U = 'Wii U'
    WII_U_DOWNLOADS = 'Wii U Downloads'
    VIRTUAL_CONSOLE_WIIU = 'Virtual Console (WiiU)'
    WINDOWS_PHONE_7 = 'Windows Phone 7'
    WINDOWS_STORE = 'Windows Store'
    WONDERSWAN_COLOR = 'WonderSwan/Color'
    XAVIXPORT = 'XaviXPORT'
    XBOX = 'Xbox'
    XBOX_360 = 'Xbox 360'
    XBOX_GAME_PASS = 'Xbox Game Pass'
    XBOX_LIVE_ARCADE = 'Xbox LIVE Arcade'
    XNA_INDIE_GAMES = 'XNA Indie Games'
    XBOX_360_GAMES_ON_DEMAND = 'Xbox 360 Games on Demands'
    XBOX_ONE ='Xbox One'
    XBOX_ONE_DOWNLOADS = 'Xbox One Downloads'
    XBOX_SERIES_X = 'Xbox Series X'
    ZEEBO = 'Zeebo'
    ZUNE = 'Zune'
    ZX_SPECTRUM = 'ZX Spectrum'
    ZX_SPECTRUM_NEXT = 'ZX Spectrum Next'



class Region(Enum):
    NAM = 'NAM'
    JP= 'JP'
    PAL = 'PAL'
    CN = 'CN'
    KR= 'KR'
    BR = 'BR'
    OTHER = 'Other'

class Game(db.Model):
    __tablename__ = 'games'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    system = db.Column(db.Enum(System), nullable=False)
    region = db.Column(db.Enum(Region), nullable=False)

    #Relationships
    game = db.relationship('Entry', back_populates='game_entries', cascade='all, delete-orphan')
    game_review = db.relationship('Review', back_populates='reviews', cascade='all, delete-orphan')



    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'system': self.system.value,
            'region': self.region.value
        }
