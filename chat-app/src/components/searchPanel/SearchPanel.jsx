import { useState } from "react";

import './searchPanel.scss'

const SearchPanel = ({updateTerm}) => {
    const [term, setTerm] = useState('');

    const onUpdateSearch = (e) => {
        const term = e.target.value;
        setTerm(term);
        updateTerm(term.toLowerCase());
        
    }
    return(
        <input 
            type="text" 
            placeholder="Search..."
            className="searchInput"
            value={term}  
            onChange={onUpdateSearch} />
    );
} 

export default SearchPanel;