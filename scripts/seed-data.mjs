import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CLIENTS_DATA = [
  { enseigne: "ACIMA", raison_sociale: "ACIMA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA 2 MARS" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA AIT MELLOUL" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA BEAUSEJOUR" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA BENI MELAL" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA BERNOUSSI" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA BERRCHID" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA BOULEVARD" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA DAR BOUAZZA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA EL HAJEB" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA EL JADIDA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA EMILE ZOLA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA ERRACHIDIA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA FES CHAMPS DE COURSE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA FES II" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA FES SEFROU" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA FES-SALAM" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA GHANDI" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA HARHOURA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA HAY EL FIDA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA HAY RIAD" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA IBN TACHEFINE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA INARA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA KENITRA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA LAMENAIS" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA LHJAJMA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA LIBERTE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MAGASIN DU PANORAMA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MAJORELLE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MARRAKECH EL MASSIRA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MARRAKECH GUELIZ" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MARRAKECH SEMLALIA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MEKNES ZAITOUNE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MIDELT" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MOHAMMEDIA PARC" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA MY ISMAIL" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA OCEAN RABAT" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA OUJDA EL QODS" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA OUJDA MEDINA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA OULFA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA PAQUET" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA PARC PLAZZA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA RABAT CHAMPION" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA RABAT CITY CENTER" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA RFA COOPERAT°" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA RYAD ANFA CASA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA SAFI" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA SALE ONCF" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA SIDI OTHMAN" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TANGER" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TANGER CASTILLA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TANGER CITY CENTRE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TANGER IBERIA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TEMARA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TETOUAN" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA TWIN CENTER" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA XPRESS BOURGONE" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA XPRESS GAUTHIER" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA XPRESS OULFA" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA XPRESS VALFLEURI" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA ZAER" },
  { enseigne: "ACIMA", raison_sociale: "ACIMA ZELLAQUA" },
  { enseigne: "ACIMA", raison_sociale: "MARJANE MARKET AERIA MALL" },
  { enseigne: "ACIMA", raison_sociale: "MARJANE MARKET BENGUERIR" },
  { enseigne: "ACIMA", raison_sociale: "MARJANE MARKET BENI MELLA TAKADOM" },
  { enseigne: "ACIMA", raison_sociale: "MARJANE MARKET KLK CASA VIEW" },
  { enseigne: "ACIMA", raison_sociale: "MARJANE MARKET PANORAMIQUE" },
  { enseigne: "ACIMA", raison_sociale: "MARJANE MARKET VICTORIA CITY" },
  { enseigne: "ACIMA", raison_sociale: "MM AGADIR HA MOHAMMEDI" },
  { enseigne: "ACIMA", raison_sociale: "MM BOUSKOURA BO VILLAGE 1" },
  { enseigne: "ACIMA", raison_sociale: "MM BOUSKOURA VERTINTA" },
  { enseigne: "ACIMA", raison_sociale: "MM BOUZKOURA BO VILLAGE II" },
  { enseigne: "ACIMA", raison_sociale: "MM BOUZNIKA MANDARONA" },
  { enseigne: "ACIMA", raison_sociale: "MM CASA KLK ALMAZ" },
  { enseigne: "ACIMA", raison_sociale: "MM CASA LAYMOUNE" },
  { enseigne: "ACIMA", raison_sociale: "MM CASA SIDI MOUMEN" },
  { enseigne: "ACIMA", raison_sociale: "MM CASA TADDART" },
  { enseigne: "ACIMA", raison_sociale: "MM CASA TAH" },
  { enseigne: "ACIMA", raison_sociale: "MM CASA VAL FLEURI" },
  { enseigne: "ACIMA", raison_sociale: "MM EL JADIDA NAJD" },
  { enseigne: "ACIMA", raison_sociale: "MM LISSASFA" },
  { enseigne: "ACIMA", raison_sociale: "MM O VILLAGE" },
  { enseigne: "ACIMA", raison_sociale: "MM RABAT EL MENZEH MAJORELLE" },
  { enseigne: "ACIMA", raison_sociale: "MM RABAT EL MENZH INDIGO III" },
  { enseigne: "ACIMA", raison_sociale: "MM RABAT OCEAN 2" },
  { enseigne: "ACIMA", raison_sociale: "MM SALE ELJADIDA" },
  { enseigne: "ACIMA", raison_sociale: "MM TANGER MOUJAHIDINE" },
  { enseigne: "ACIMA", raison_sociale: "MM TETOUAN BOUJERRAH" },
  { enseigne: "ACIMA", raison_sociale: "MM TETOUAN WILAYA" },
  { enseigne: "ACIMA", raison_sociale: "XPRESS BOUSKOURA" },
  { enseigne: "ACIMA", raison_sociale: "YATOUT ACIMA BENI MELLAL" },

  // AKDITAL
  { enseigne: "AKDITAL", raison_sociale: "AKDITAL" },
  { enseigne: "AKDITAL", raison_sociale: "AKDITAL SERVICES" },
  { enseigne: "AKDITAL", raison_sociale: "ANFA PRIME HOSPITAL" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE D'ONCOLOGIE DE BEN GUERIR" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE D'ONCOLOGIE PRIVE DE SALE" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE INTERNATIONAL D'ONCOLOGIE RABAT" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE INTERNATIONAL ONCOLOGIE AGADIR" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE INTERNATIONAL ONCOLOGIE CASA" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE INTERNATIONAL ONCOLOGIE FES" },
  { enseigne: "AKDITAL", raison_sociale: "CENTRE INTERNATIONAL ONCOLOGIE OUJDA" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE AIN BORJA" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE DE BIEN-ETRE BOUSKOURA" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE DE SPECIALITES DE SAFI" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONAL DE TAROUDANT" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONAL INEZGANE" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONALE DE DAKHLA" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONALE DE MOGADOR" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONALE ERRACHIDIA" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONALE MOHAMMEDIA" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE JERRADA OASIS" },
  { enseigne: "AKDITAL", raison_sociale: "CLINIQUE INTERNATIONALE DE KHOURIBGA" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL INTERNATIONAL AGADIR" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL INTERNATIONAL DE FES" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL INTERNATIONAL DE KENITRA" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL INTERNATIONAL IBN NAFIS" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE AL KHAIR" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE BENI MELLAL" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE DE CASABLANCA AIN SBAA" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE DE SALE" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE DE TANGER" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE DE TETOUAN" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE ELJADIDA" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE GUELMIM" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE IBN YASSINE RABAT" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE MEKNES" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE NADOR" },
  { enseigne: "AKDITAL", raison_sociale: "HOPITAL PRIVE OUJDA" },
  { enseigne: "AKDITAL", raison_sociale: "POLYCLINIQUE DE LAAYOUNE" },
  { enseigne: "AKDITAL", raison_sociale: "SIEGE AKDITAL" },

  // ASWAK ASSALAM
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK AGADIR TALBORJT" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM (SIEGE)" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM AGADIR" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM CASA OULED ZIANE" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM ESSAOUIRA LJADIDIA" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM GUELIZ" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM HAY EL FATH RABAT" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM KENITRA" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM MARRAKECH" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM MOHAMMEDIA" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM OUJDA" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM RABAT" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM TANGER" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ASSALAM TEMARA" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ESSALAM" },
  { enseigne: "ASWAK ASSALAM", raison_sociale: "ASWAK ESSALAM ESSAOUIRA" },

  // BIM
  { enseigne: "BIM", raison_sociale: "BIM MAROC" },
  { enseigne: "BIM", raison_sociale: "BIM MAROC AIN HARROUDA" },
  { enseigne: "BIM", raison_sociale: "BIM MAROC BOUSKOURA" },
  { enseigne: "BIM", raison_sociale: "BIM MAROC MOHAMMEDIA" },
  { enseigne: "BIM", raison_sociale: "BIM MARRAKECH" },

  // HYPER LABEL VIE
  { enseigne: "HYPER LABEL VIE", raison_sociale: "CARREFOUR DECO-ART" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPER MARCHE LV" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPER MARCHE LV TEMARA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPER-SUD-AIN SEBAA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPER-SUD-ALMAZ" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPER-SUD-BENI MELLAL" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPER-SUD-ZENATA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE BOUSKOURA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-AGADIR" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-ALMAZAR" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-BERRECHID" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-BORJ FES" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-DAR BOUAAZA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-OUJDA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-SALE" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-TANGER" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-TARGA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "HYPERMARCHE LV-TETOUANE" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-AGADIR" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-AIN SBAA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-EL JADIDA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-KENITRA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-KHMISSET" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-MEDINA" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-MEKNES" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-RABAT(SIEGE)" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-RIAD" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-SETTAT" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-SKHIRAT" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-VELODROME" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "LABELVIE-ZAER" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "RFA HYPER MARCHE" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "RFA LA BEL VIE" },
  { enseigne: "HYPER LABEL VIE", raison_sociale: "SUPECO CASA AIN CHOCK" },

  // HYPER U
  { enseigne: "HYPER U", raison_sociale: "HYPER U ZENATA" },
  { enseigne: "HYPER U", raison_sociale: "UNICINQ HOLDING" },

  // ISTIKBAL
  { enseigne: "ISTIKBAL", raison_sociale: "BFDIS SARL (ISTIKBAL MARRAKECH)" },
  { enseigne: "ISTIKBAL", raison_sociale: "BFDIS SARL (ISTIKBAL TANGER)" },
  { enseigne: "ISTIKBAL", raison_sociale: "BFDIS SARL ISTIKBAL FES" },
  { enseigne: "ISTIKBAL", raison_sociale: "HOMDOM (ISTIKBAL BOUSKOURA)" },
  { enseigne: "ISTIKBAL", raison_sociale: "HOMDOM (ISTIKBAL DAR BOUAZZA)" },
  { enseigne: "ISTIKBAL", raison_sociale: "HOMDOM (ISTIKBAL SALE MARINA)" },
  { enseigne: "ISTIKBAL", raison_sociale: "HOMDOM(ISTIKBAL AGADIR TILILA)" },
  { enseigne: "ISTIKBAL", raison_sociale: "ISTIKBAL AGADIR SELA" },
  { enseigne: "ISTIKBAL", raison_sociale: "MARYMEUBLE SA ISTIKBAL RABAT CENTRE" },
  { enseigne: "ISTIKBAL", raison_sociale: "MFIN SA ISTIKBAL 2MARS" },
  { enseigne: "ISTIKBAL", raison_sociale: "MFIN SA ISTIKBAL AGDAL" },
  { enseigne: "ISTIKBAL", raison_sociale: "MFIN SA ISTIKBAL GHANDI" },
  { enseigne: "ISTIKBAL", raison_sociale: "MFIN SA ISTIKBAL KENITRA" },
  { enseigne: "ISTIKBAL", raison_sociale: "MFIN SA ISTIKBAL MOHAMMEDIA" },
  { enseigne: "ISTIKBAL", raison_sociale: "RAMCOM ISTIKBAL AIN SEBAA" },
  { enseigne: "ISTIKBAL", raison_sociale: "RAMCOM ISTIKBAL EL JADIDIA" },
  { enseigne: "ISTIKBAL", raison_sociale: "RAMCOM SARL ISTIKBAL FES AGDAL" },

  // MARJANE
  { enseigne: "MARJANE", raison_sociale: "ENTREPOT MARJANE SA" },
  { enseigne: "MARJANE", raison_sociale: "MARANE HOLDING (RFA & COOPERAT°)" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE ARRIBAT CENTER" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE BERKANE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE BOUSKOURA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE EL JADIDA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE FKIH BENSALEH" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE GUELMIM" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HAMRIA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING AGADIR" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING AIN SBAA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING BENI MELLAL" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING BOUREGREG" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING CALIFORNIE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING COFARMA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING DERB SOLTANE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING FES" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING FES2" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING HAY HASSANI" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING HAY RIAD" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING HOCEIMA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING KENITRA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING KHOURIBGUA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING MARRAK EL MASSIRA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING MARRAKECH MENARA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING MEKNES" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING MOHAMMEDIA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING NADOR" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING OUJDA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING SAFI" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING SALE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING TANGER MEDINA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING TANGER2" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING TAZA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE HOLDING TETOUAN" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE IBN TACHFINE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE INZEGANE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE KALAA SRAGHNA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE KENITRA II" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE LAAYOUNE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE LARACHE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE MALL" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE MARINA" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE MOROCCO MALL" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE OUARZAZATE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE SIDI OTMANE" },
  { enseigne: "MARJANE", raison_sociale: "MARJANE SIDI SLIMANE" },

  // MOBILIA
  { enseigne: "MOBILIA", raison_sociale: "MOBILIA" },
  { enseigne: "MOBILIA", raison_sociale: "STE MOBIFAR" },
  { enseigne: "MOBILIA", raison_sociale: "STE MOBITOP" },

  // MOBILIUM
  { enseigne: "MOBILIUM", raison_sociale: "ALBOR MOBILIUM AGADIR TASILA" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM ( MOBILIUM 2MARS )" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM ( MOBILIUM TEMARA )" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM (MOBILIUM AGADIR SELA)" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM (MOBILIUM BOUSKOURA)" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM (MOBILIUM LARRACHE)" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM (MOBILIUM SALE MARINA)" },
  { enseigne: "MOBILIUM", raison_sociale: "HOMDOM(MOBILIUM MEKNES ATACADAO)" },
  { enseigne: "MOBILIUM", raison_sociale: "MOBILIUM RABAT AGDAL" },
  { enseigne: "MOBILIUM", raison_sociale: "XHENSEVAL CLAUDE" },

  // YADECO
  { enseigne: "YADECO", raison_sociale: "BFDIS S.A (YADECO TANGER EL AMINE)" },
  { enseigne: "YADECO", raison_sociale: "DECOFORT" },
  { enseigne: "YADECO", raison_sociale: "MFIN S.A ( YADECO FES )" },
  { enseigne: "YADECO", raison_sociale: "MFIN S.A ( YADECO MARJANE TANGER )" },
  { enseigne: "YADECO", raison_sociale: "MFIN S.A ( YADECO ZERKTOUNI )" },
  { enseigne: "YADECO", raison_sociale: "MFIN S.A (YADECO KENITRA)" },
  { enseigne: "YADECO", raison_sociale: "MFIN SA YADECO MARRAKECH" },
  { enseigne: "YADECO", raison_sociale: "MFIN SA YADECO SAFI" },
  { enseigne: "YADECO", raison_sociale: "RAMCOM ( YADECO MEKNES )" },
  { enseigne: "YADECO", raison_sociale: "YADECO LARACHE" },

  // YATOUT
  { enseigne: "YATOUT", raison_sociale: "MARDIS" },
  { enseigne: "YATOUT", raison_sociale: "MARDIS (YATOUT 2MARS)" },
  { enseigne: "YATOUT", raison_sociale: "MARDIS (YATOUT ENARA)" },
  { enseigne: "YATOUT", raison_sociale: "MARDIS (YATOUT MAARIF)" },
  { enseigne: "YATOUT", raison_sociale: "MARESCOF SARL" },
  { enseigne: "YATOUT", raison_sociale: "MARYMES SNC (YATOUT MEKNES HAMRIA)" },
  { enseigne: "YATOUT", raison_sociale: "MFIN SA YATOUT KIDS 2 MARS" },
  { enseigne: "YATOUT", raison_sociale: "SOKORAL SNC (YATOUT KHOURIBGHA)" },
  { enseigne: "YATOUT", raison_sociale: "STE MYLM" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT AGDAL" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT ASWAK ASSALAM" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT BOURGOUGNE" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT EL AKKARI" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT EL JADIDA" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT GUELMIM" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT HASSAN II" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT HAY KARIMA" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT HOME LKSAR" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT LARRACHE" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT MARJANE AIN SEBAA" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT MLY YOUSSEF TANGER" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT NADOR" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT OULED OUJIH" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT PALACE" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT SALE BAB SEBTA" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT SALE EL JADIDA" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT SALE TABRIKET" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT TANGER BERCHET" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT TEMARA" },
  { enseigne: "YATOUT", raison_sociale: "YATOUT TIZNIT" },

  // YATOUT HOME
  { enseigne: "YATOUT HOME", raison_sociale: "BFDIS SARL (YATOUT HOME MARRAKECH)" },
  { enseigne: "YATOUT HOME", raison_sociale: "MARYMEUBLE YATOUT HOME RABAT CENTRE" },
  { enseigne: "YATOUT HOME", raison_sociale: "MFIN SA" },
  { enseigne: "YATOUT HOME", raison_sociale: "MFIN SA YATOUT HOME MOHAMMEDIA" },
  { enseigne: "YATOUT HOME", raison_sociale: "MYLM SARL YATOUT HOME AGADIR" },
  { enseigne: "YATOUT HOME", raison_sociale: "MYLM YATOUT HOME NEJMA" },
  { enseigne: "YATOUT HOME", raison_sociale: "RAMCOM SARL YATOUT HOME FES AGDAL" },
  { enseigne: "YATOUT HOME", raison_sociale: "RAMCOM YATOUT HOME AIN SEBAA" },
  { enseigne: "YATOUT HOME", raison_sociale: "RAMCOM YATOUT HOME EL JADIDA" },
  { enseigne: "YATOUT HOME", raison_sociale: "YATOUT HOME AGADIR" },
  { enseigne: "YATOUT HOME", raison_sociale: "YATOUT HOME KENITRA" },
  { enseigne: "YATOUT HOME", raison_sociale: "YATOUT MARRAKECH MASSIRA" },
  { enseigne: "YATOUT HOME", raison_sociale: "YATOUT MOHAMMEDIA" },
];

const ENSEIGNES = [...new Set(CLIENTS_DATA.map(c => c.enseigne))].sort();

async function seedDatabase() {
  console.log('🚀 Starting database seed...');
  console.log(`📊 Found ${ENSEIGNES.length} enseignes and ${CLIENTS_DATA.length} stores\n`);

  // Insert enseignes
  console.log('📝 Inserting enseignes...');
  const enseigneData = ENSEIGNES.map(name => ({ name }));
  const { error: enseigneError } = await supabase
    .from('enseignes')
    .upsert(enseigneData, { onConflict: 'name' });

  if (enseigneError) {
    console.error('❌ Error inserting enseignes:', enseigneError);
    return;
  }
  console.log(`✅ Inserted ${ENSEIGNES.length} enseignes\n`);

  // Get all enseignes with their IDs
  const { data: enseignes, error: fetchError } = await supabase
    .from('enseignes')
    .select('id, name');

  if (fetchError || !enseignes) {
    console.error('❌ Error fetching enseignes:', fetchError);
    return;
  }

  const enseigneMap = new Map(enseignes.map(e => [e.name, e.id]));

  // Insert stores in batches
  console.log('🏪 Inserting stores...');
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < CLIENTS_DATA.length; i += batchSize) {
    const batch = CLIENTS_DATA.slice(i, i + batchSize);
    const storeData = batch.map(client => ({
      name: client.raison_sociale,
      enseigne_id: enseigneMap.get(client.enseigne),
    }));

    const { error: storeError } = await supabase
      .from('stores')
      .upsert(storeData, { onConflict: 'name,enseigne_id' });

    if (storeError) {
      console.error(`❌ Error inserting stores batch ${i / batchSize + 1}:`, storeError);
    } else {
      inserted += batch.length;
      process.stdout.write(`\r✅ Progress: ${inserted}/${CLIENTS_DATA.length} stores inserted`);
    }
  }

  console.log('\n\n🎉 Database seed complete!');
  console.log(`📈 Summary: ${ENSEIGNES.length} enseignes, ${CLIENTS_DATA.length} stores`);
}

seedDatabase().catch(console.error);
