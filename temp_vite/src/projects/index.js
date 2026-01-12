import { headphoneProject } from './headphone';
import { cherryProject } from './cherry';
import { masterSwordStandProject } from './master-sword-stand';
import { paperTowelHolderProject } from './paper-towel-holder';

export const PROJECTS = {
    headphone: headphoneProject,
    cherry: cherryProject,
    'master-sword-stand': masterSwordStandProject,
    'paper-towel-holder': paperTowelHolderProject
};

export const PROJECT_LIST = Object.values(PROJECTS);
