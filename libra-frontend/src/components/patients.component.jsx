import React from 'react';
import  Patient  from './patient-profile/patient.component';
import './patients.css';
import PatientExpand from "./patient-profile/patientexpand.component";

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';




const Patients = () => {

  
  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Patient Management Page</h1>
         <Fab color="primary" aria-label="add">
            <AddIcon />
        </Fab>
      </header>
      <div className="patients">
        <PatientExpand title = "Halil Şahiner">
              <Patient  isPrivate={true} name="Halil" surname="Şahiner" nationalID="1233" nationality="Turkish" VCFfile="halil_sahiner.vcf" phenotypes={["type1","type2"]} genotypes={["type1","type2"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1",                                                                                                                                                                                                  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.2dFc78Kiy8NpZhZQnkbf2AHaEJ%26pid%3DApi&f=1"]} />
        </PatientExpand>  
        <PatientExpand title = "Halil2 Şahiner">
        <Patient  name="Halil2" surname="Şahiner" nationalID="1234" nationality="Turkish" VCFfile="halil2_sahiner.vcf" phenotypes={["type5","type23"]} genotypes={["type8","type222"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1",
                                                                                                                                                                                                  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.2dFc78Kiy8NpZhZQnkbf2AHaEJ%26pid%3DApi&f=1"]} />
        </PatientExpand>
        <PatientExpand title = "Halil3 Şahiner">
        <Patient  name="Halil3" surname="Şahiner" nationalID="1235" nationality="Turkish" VCFfile="halil3_sahiner.vcf" phenotypes={["type3","type21"]} genotypes={["type9","type2123"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1",
                                                                                                                                                                                                    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.2dFc78Kiy8NpZhZQnkbf2AHaEJ%26pid%3DApi&f=1"]} />
        </PatientExpand>
        <PatientExpand title = "Halil4 Şahiner">
        <Patient  name="Halil4" surname="Şahiner" nationalID="1236" nationality="Turkish" VCFfile="halil4_sahiner.vcf" phenotypes={["type7","type26"]} genotypes={["type10","type211"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1"]} />
        </PatientExpand>
      </div>
      
    </div>
  );
};

export default Patients;