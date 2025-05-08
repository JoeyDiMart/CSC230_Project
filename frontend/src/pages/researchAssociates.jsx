import React from "react";
import "./researchAssociates.css"; // Make sure your CSS is linked

const associates = [
  {
    name: "Brandon Dulisse",
    title: "Director of CIRT",
    specialties: "Corrections, Cybercrime, Financial Crime, Criminal Justice Policy",
    email: "Bdulisse@ut.edu",
    img: "/brandonDulisse.jpg"
  },
  {
    name: "Nate Connealy",
    title: "Associate Director of Consultation and Training",
    specialties: "Policing/Law Enforcement, Criminal Justice Policy, Quantitative Data",
    email: "Nconnealy@ut.edu",
    img: "/defaultResearchAssociates.jpg"
  },
  {
    name: "Chivon Fitch",
    title: "CIRT Liaison to the Industry Advisory Board",
    specialties: "Policing/Law Enforcement, Criminal Justice Policy, Victimization, Corrections",
    email: "Cfitch@ut.edu",
    img: "/chivonFitch.jpg"
  },
  {
    name: "Tim Hart",
    title: "Associate Director of Research and Engagement",
    specialties: "Victimization, Crime Analysis/Mapping",
    email: "Thart@ut.edu",
    img: "/timHart.jpg"
  },
  {
    name: "Amanda Osuna",
    title: "Research Associate",
    specialties: "Victimization, Vulnerability and Intersectionality",
    email: "Aosuna@ut.edu",
    img: "/amandaOsuna.jpg"
  },
  {
    name: "Leo Genco",
    title: "Research Associate",
    specialties: "Violent Crime, Wildlife and Environmental Crime, Animal Cruelty",
    email: "Lgenco@ut.edu",
    img: "/defaultResearchAssociates.jpg"
  },
  {
    name: "Carly Hilinski-Rosick",
    title: "Research Associate",
    specialties: "Victimization, Corrections",
    email: "Chilinskirosick@ut.edu",
    img: "/carlyHilinskiRosick.jpg"
  },
  {
    name: "Cedric Michel",
    title: "Research Associate",
    specialties: "Criminal Justice Policy, Victimization, Courts/Sentencing, Criminal Justice Reform, White-Collar Crime, Death Penalty",
    email: "Cmichel@ut.edu",
    img: "/cedricMichel.jpg"
  },
  {
    name: "Kathryn Branch",
    title: "Research Associate",
    specialties: "Victimization",
    email: "kbranch@ut.edu",
    img: "/defaultResearchAssociates.jpg"
  },
  {
    name: "Kayla Toohy",
    title: "Research Associate",
    specialties: "Victimization, Violent Crime",
    email: "ktoohy@ut.edu",
    img: "/defaultResearchAssociates.jpg"
  },
  {
    name: "Gabriel Paez",
    title: "Research Associate",
    specialties: "Policing/Law Enforcement, Victimization",
    email: "gpaez@ut.edu",
    img: "/gabrielPaez.jpg"
  },
  {
    name: "Cassidy Tevlin",
    title: "Research Associate",
    specialties: "Criminal Justice Policy, Juvenile Justice, Developmental Criminology, Biosocial Criminology",
    email: "ctevlin@ut.edu",
    img: "/cassidyTevlin.jpg"
  }
];

function ResearchAssociates() {
  return (
    <div className="researchAssociates">
        <div>
            <h1>Meet Our Research Associates</h1>
            <p className="flex items-center justify-center text-center">Experts in criminology, justice reform, and social research dedicated to impactful work at the University of Tampa.</p>
        </div>

      <div className="grid-researchAssociates">
        {associates.map((person, i) => (
          <div className="box" key={i}>
            <div className="box-image">
              <img src={person.img} alt={person.name} />
            </div>
            <div className="box-content">
              <h3 className="name">{person.name}</h3>
              <h4>{person.title}</h4>
              <h4>Specialties: {person.specialties}</h4>
              <a href={`mailto:${person.email}`} className="emailButton hover:bg-cirtRed  rounded-md transition-colors duration-300 ease-in-out ">{person.email}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchAssociates;
