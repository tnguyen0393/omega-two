import styles from './Card.module.css';

export default function Card({ rank, suit, symbolCount, symbol }) {
    const suitSymbol = {
        Hearts: '♥',
        Diamonds: '♦',
        Clubs: '♣',
        Spades: '♠',
    };

    const isRed = suit === 'Hearts' || suit === 'Diamonds';

    const renderSymbols = () => {
        if (symbol) {
            return <span className={styles.faceSymbol}>{symbol}</span>;
        }

        return Array.from({ length: symbolCount }, (_, index) => (
            <span key={index} className={styles.symbol}>
                {suitSymbol[suit]}
            </span>
        ));
    };

    return (
        <div className={`${styles.card} ${isRed ? styles.red : styles.black}`}>
            <div className={styles.topLeft}>
                <span>{rank}</span>
                <span>{suitSymbol[suit]}</span>
            </div>
            <div className={styles.suitCenter}>
                {renderSymbols()}
            </div>
            <div className={styles.bottomRight}>
                <span>{rank}</span>
                <span>{suitSymbol[suit]}</span>
            </div>
        </div>
    );
}
