import { useState, useEffect } from 'react';

// 注音符號與其位置的映射（保持不變）
const ZHUYIN_KEYS = [
  // 聲母 - 第一區
  { key: 'ㄅ', x: 0, y: 0, type: 'consonants' },
  { key: 'ㄆ', x: 0, y: 1, type: 'consonants' },
  { key: 'ㄇ', x: 0, y: 2, type: 'consonants' },
  { key: 'ㄈ', x: 0, y: 3, type: 'consonants' },
  
  { key: 'ㄉ', x: 1, y: 0, type: 'consonants' },
  { key: 'ㄊ', x: 1, y: 1, type: 'consonants' },
  { key: 'ㄋ', x: 1, y: 2, type: 'consonants' },
  { key: 'ㄌ', x: 1, y: 3, type: 'consonants' },

  { key: 'ㄍ', x: 2, y: 0, type: 'consonants' },
  { key: 'ㄎ', x: 2, y: 1, type: 'consonants' },
  { key: 'ㄏ', x: 2, y: 2, type: 'consonants' },

  { key: 'ㄐ', x: 3, y: 0, type: 'consonants' },
  { key: 'ㄑ', x: 3, y: 1, type: 'consonants' },
  { key: 'ㄒ', x: 3, y: 2, type: 'consonants' },

  { key: 'ㄓ', x: 4, y: 0, type: 'consonants' },
  { key: 'ㄔ', x: 4, y: 1, type: 'consonants' },
  { key: 'ㄕ', x: 4, y: 2, type: 'consonants' },
  { key: 'ㄖ', x: 4, y: 3, type: 'consonants' },

  { key: 'ㄗ', x: 5, y: 0, type: 'consonants' },
  { key: 'ㄘ', x: 5, y: 1, type: 'consonants' },
  { key: 'ㄙ', x: 5, y: 2, type: 'consonants' },

  // 韻母 - 第二區
  { key: 'ㄧ', x: 7, y: 0, type: 'vowels' },
  { key: 'ㄨ', x: 7, y: 1, type: 'vowels' },
  { key: 'ㄩ', x: 7, y: 2, type: 'vowels' },

  { key: 'ㄚ', x: 8, y: 0, type: 'vowels' },
  { key: 'ㄛ', x: 8, y: 1, type: 'vowels' },
  { key: 'ㄜ', x: 8, y: 2, type: 'vowels' },
  { key: 'ㄝ', x: 8, y: 3, type: 'vowels' },

  { key: 'ㄞ', x: 9, y: 0, type: 'vowels' },
  { key: 'ㄟ', x: 9, y: 1, type: 'vowels' },
  { key: 'ㄠ', x: 9, y: 2, type: 'vowels' },
  { key: 'ㄡ', x: 9, y: 3, type: 'vowels' },

  { key: 'ㄢ', x: 10, y: 0, type: 'vowels' },
  { key: 'ㄣ', x: 10, y: 1, type: 'vowels' },
  { key: 'ㄤ', x: 10, y: 2, type: 'vowels' },
  { key: 'ㄥ', x: 10, y: 3, type: 'vowels' },
  { key: 'ㄦ', x: 10, y: 4, type: 'vowels' },
];

const TONE_KEYS = ['ˊ', 'ˇ', 'ˋ', '˙'].map((key, index) => ({
  key,
  x: 11,
  y: index,
  type: 'tones'
}));

const ALL_KEYS = [...ZHUYIN_KEYS, ...TONE_KEYS];

const ZhuyinTypingGame = () => {
  const [typedText, setTypedText] = useState('');
  const [targetChar, setTargetChar] = useState('好');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempChar, setTempChar] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyClick = (key: string) => {
    const isTone = ['ˊ', 'ˇ', 'ˋ', '˙'].includes(key);
    const isConsonant = ZHUYIN_KEYS.some(k => k.type === 'consonants' && k.key === key);
    const isSpecialVowel = ['ㄧ', 'ㄨ', 'ㄩ'].includes(key);
    const isRegularVowel = ZHUYIN_KEYS.some(k => k.type === 'vowels' && !['ㄧ', 'ㄨ', 'ㄩ'].includes(k.key) && k.key === key);
    
    let newText = typedText;
    
    if (isConsonant) {
      // For consonants, replace any existing consonant or place at start
      const hasConsonant = ZHUYIN_KEYS.some(k => k.type === 'consonants' && typedText.includes(k.key));
      if (hasConsonant) {
        // Replace existing consonant while preserving other characters
        const nonConsonants = typedText.split('').filter(char => 
          !ZHUYIN_KEYS.some(k => k.type === 'consonants' && k.key === char)
        ).join('');
        newText = key + nonConsonants;
      } else {
        // Place consonant at start
        newText = key + typedText;
      }
    } else if (isRegularVowel) {
      // For regular vowels (not ㄧㄨㄩ), replace existing regular vowel or place at end
      const hasRegularVowel = ZHUYIN_KEYS.some(k => 
        k.type === 'vowels' && 
        !['ㄧ', 'ㄨ', 'ㄩ'].includes(k.key) && 
        typedText.includes(k.key)
      );
      
      if (hasRegularVowel) {
        // Remove existing regular vowel and add new one at the end
        const withoutRegularVowel = typedText.split('').filter(char => 
          !ZHUYIN_KEYS.some(k => 
            k.type === 'vowels' && 
            !['ㄧ', 'ㄨ', 'ㄩ'].includes(k.key) && 
            k.key === char
          )
        ).join('');
        newText = withoutRegularVowel + key;
      } else {
        // Add new regular vowel at the end
        newText = typedText + key;
      }
    } else if (isSpecialVowel) {
      // Special vowels (ㄧㄨㄩ) should be placed before regular vowels and are mutually exclusive
      const chars = typedText.split('');
      // Remove any existing special vowel
      const charsWithoutSpecialVowel = chars.filter(char => !['ㄧ', 'ㄨ', 'ㄩ'].includes(char));
      
      const hasRegularVowel = charsWithoutSpecialVowel.some(char => 
        ZHUYIN_KEYS.some(k => 
          k.type === 'vowels' && 
          !['ㄧ', 'ㄨ', 'ㄩ'].includes(k.key) && 
          k.key === char
        )
      );

      if (hasRegularVowel) {
        // Separate characters into different types
        const consonants = charsWithoutSpecialVowel.filter(char => 
          ZHUYIN_KEYS.some(k => k.type === 'consonants' && k.key === char)
        );
        const regularVowel = charsWithoutSpecialVowel.find(char => 
          ZHUYIN_KEYS.some(k => 
            k.type === 'vowels' && 
            !['ㄧ', 'ㄨ', 'ㄩ'].includes(k.key) && 
            k.key === char
          )
        );
        const tones = charsWithoutSpecialVowel.filter(char => 
          ['ˊ', 'ˇ', 'ˋ', '˙'].includes(char)
        );

        // Reconstruct the text in the correct order
        newText = [
          ...consonants,
          key, // Add only the new special vowel
          regularVowel,
          ...tones
        ].filter(Boolean).join('');
      } else {
        // If no regular vowel, reconstruct with only the new special vowel
        newText = [...charsWithoutSpecialVowel, key].join('');
      }
    } else if (isTone) {
      // Handle tones (mutually exclusive)
      const hasTone = ['ˊ', 'ˇ', 'ˋ', '˙'].some(tone => typedText.includes(tone));
      if (hasTone) {
        newText = typedText.replace(/[ˊˇˋ˙]/g, '') + key;
      } else {
        newText = typedText + key;
      }
    } else {
      // For other characters, just append and move any existing tone to the end
      const toneMatch = typedText.match(/[ˊˇˋ˙]/);
      if (toneMatch) {
        const tone = toneMatch[0];
        newText = typedText.replace(/[ˊˇˋ˙]/g, '') + key + tone;
      } else {
        newText = typedText + key;
      }
    }
    
    setTypedText(newText);
  };

  const handleCharacterClick = () => {
    setTempChar('');
    setIsModalOpen(true);
  };

  const handleCharacterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempChar(e.target.value);
  };

  const handleCharacterSubmit = () => {
    const lastChar = tempChar.slice(-1);
    const isSingleChineseChar = /^[\u4e00-\u9fff]$/.test(lastChar);
    
    if (isSingleChineseChar) {
      setTargetChar(lastChar);
      setTypedText('');
      setIsModalOpen(false);
    } else {
      alert('必須是一個中文字');
    }
  };

  const getCharacterType = (char: string) => {
    if (['ˊ', 'ˇ', 'ˋ', '˙'].includes(char)) return 'tone';
    if (['ㄧ', 'ㄨ', 'ㄩ'].includes(char)) return 'special-vowel';
    if (ZHUYIN_KEYS.some(k => k.type === 'consonants' && k.key === char)) return 'consonant';
    if (ZHUYIN_KEYS.some(k => k.type === 'vowels' && k.key === char)) return 'vowel';
    return 'other';
  };

  const getCharacterColor = (type: string) => {
    switch (type) {
      case 'consonant': return 'text-blue-600';
      case 'special-vowel': return 'text-purple-600';
      case 'vowel': return 'text-green-600';
      case 'tone': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getButtonStyle = (key: string) => {
    const type = getCharacterType(key);
    const baseStyle = 'w-16 h-16 rounded-xl shadow-md transition-all duration-200 transform hover:scale-125 flex items-center justify-center text-5xl font-bold ';
    const colorStyle = {
      consonant: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      'special-vowel': 'bg-purple-50 hover:bg-purple-100 text-purple-600',
      vowel: 'bg-green-50 hover:bg-green-100 text-green-600',
      tone: 'bg-red-50 hover:bg-red-100 text-red-600',
      other: 'bg-gray-50 hover:bg-gray-100 text-gray-600'
    }[type];
    
    return baseStyle + colorStyle;
  };

  return (
    <div className={`w-full min-h-screen pt-16 ${isMobile ? '' : 'min-w-[1100px]'}`}>
      {/* 目標字顯示區域 */}
      <div className="flex justify-center mb-2">
        <div className="flex flex-row items-center gap-4">
          <div style={{ writingMode: 'vertical-rl' }}>
            <div className="text-9xl">
              <div className="relative">
                <span 
                  onClick={handleCharacterClick}
                  className="cursor-pointer hover:text-blue-600 transition-colors block"
                >
                  {targetChar}
                </span>
                <div 
                  className="text-5xl absolute left-full ml-2 cursor-pointer flex flex-col gap-1" 
                  onClick={() => setTypedText('')}
                  style={{ 
                    top: '50%', 
                    transform: 'translateY(100%) translateX(20%)',
                    transformOrigin: 'left center'
                  }}
                >
                  {typedText.split('').map((char, index) => {
                    const type = getCharacterType(char);
                    const colorClass = getCharacterColor(type);
                    
                    if (type === 'tone') {
                      // Find the last non-tone character's index
                      const lastCharIndex = typedText.split('').findLastIndex((c, i) => i < index && getCharacterType(c) !== 'tone');
                      const basePosition = lastCharIndex >= 0 ? lastCharIndex * 60 - 85 : -85;
                      
                      const style: React.CSSProperties = char === '˙' 
                        ? { 
                            position: 'absolute', 
                            top: `${basePosition - 35}px`, 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            fontSize: '5rem' 
                          }
                        : { 
                            position: 'absolute', 
                            top: `${basePosition}px`,
                            left: '80px', 
                            transform: 'translateX(-50%) rotate(-90deg)', 
                            fontSize: '5rem' 
                          };
                      
                      return <span key={index} className={colorClass} style={style}>{char}</span>;
                    }
                    
                    return (
                      <span 
                        key={index} 
                        className={colorClass}
                        style={{ 
                          position: 'absolute',
                          top: `${(index * 60 - 85)}px`,
                          left: `0px`,
                          fontSize: '3rem'
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg	w-[300px]">
            <input
              type="text"
              value={tempChar}
              onChange={handleCharacterInput}
              className="border-2 border-gray-300 rounded-lg p-4 text-4xl mb-4 w-full"
              placeholder="一個字"
              autoFocus
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleCharacterSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 鍵盤區域 */}
      <div className="mt-8">
        {isMobile ? (
          // Mobile vertical layout
          <div className="flex flex-col gap-2 mx-auto w-fit">
            {/* First row */}
            <div className="flex gap-2">
              {['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Second row */}
            <div className="flex gap-2">
              {['ㄉ', 'ㄊ', 'ㄋ', 'ㄌ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Third row */}
            <div className="flex gap-2">
              {['ㄍ', 'ㄎ', 'ㄏ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Fourth row */}
            <div className="flex gap-2">
              {['ㄐ', 'ㄑ', 'ㄒ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Fifth row */}
            <div className="flex gap-2">
              {['ㄓ', 'ㄔ', 'ㄕ', 'ㄖ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Sixth row */}
            <div className="flex gap-2">
              {['ㄗ', 'ㄘ', 'ㄙ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Seventh row */}
            <div className="flex gap-2">
              {['ㄧ', 'ㄨ', 'ㄩ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Eighth row */}
            <div className="flex gap-2">
              {['ㄚ', 'ㄛ', 'ㄜ', 'ㄝ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Ninth row */}
            <div className="flex gap-2">
              {['ㄞ', 'ㄟ', 'ㄠ', 'ㄡ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Tenth row */}
            <div className="flex gap-2">
              {['ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'].map(char => (
                <button
                  key={char}
                  className={`${getButtonStyle(char)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(char)}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Tone marks */}
            <div className="flex gap-2 mt-2">
              {['ˊ', 'ˇ', 'ˋ', '˙'].map(tone => (
                <button
                  key={tone}
                  className={`${getButtonStyle(tone)} w-12 h-12 text-3xl`}
                  onClick={() => handleKeyClick(tone)}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Desktop original layout
          <div className="bg-gray-100 p-8 rounded-2xl w-[90%] mx-auto" style={{ height: '560px' }}>
            <div className="grid grid-cols-12 gap-4">
              {ALL_KEYS.map((item) => (
                <button
                  key={item.key}
                  style={{
                    gridColumn: item.x + 1,
                    gridRow: item.y + 1,
                  }}
                  className={getButtonStyle(item.key)}
                  onClick={() => handleKeyClick(item.key)}
                >
                  {item.key}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZhuyinTypingGame;