import PropTypes from 'prop-types';
import styles from './styles/Card.module.css';

export default function Card({ nome, icone, color, iconSize = 62 }) {
  const isReactIcon = typeof icone === 'function';
  const Icon = icone; 
  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      {isReactIcon ? (
        <Icon size={iconSize} />
      ) : (
        <img src={icone} alt={nome} />
      )}
      <h2>{nome}</h2>
    </div>
  );
}

Card.propTypes = {
  nome: PropTypes.string.isRequired,
  color: PropTypes.string,
  icone: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string]),
  iconSize: PropTypes.number,
};
