import React from 'react';
import '../App.css';
import HPOTermViewer from './HPOTermViewer';

function HPO(props){
    const [name, setName] = React.useState(props.match.params.id);
    const [HPOname, setHPOName] = React.useState('');
    const [HPOdefi, setHPODefi] = React.useState('');
    const [HPOparents,setHPOParents] = React.useState([]);
    const [HPOchildren, setHPOChildren] = React.useState([]);
    return(
    <div>
    <HPOTermViewer hpoid={name} hpoSetter={setName}
                    name={HPOname} setName={setHPOName}
                    defi={HPOdefi} setDefi={setHPODefi}
                    parents={HPOparents} setParents={setHPOParents}
                    children={HPOchildren} setChildren={setHPOChildren}/>
    </div>
    );
}

export default HPO;
