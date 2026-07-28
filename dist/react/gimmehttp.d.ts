import { GimmeHTTP, Settings } from '../ui/gimmehttp';
export interface GimmeHttpProps {
    settings: Settings;
    onLanguageChange?: (language: string) => void;
    onClientChange?: (client: string) => void;
}
export interface GimmeHttpRef {
    gimmeHttp: GimmeHTTP | null;
}
declare const GimmeHttp: import('react').ForwardRefExoticComponent<GimmeHttpProps & import('react').RefAttributes<GimmeHttpRef>>;
export default GimmeHttp;
