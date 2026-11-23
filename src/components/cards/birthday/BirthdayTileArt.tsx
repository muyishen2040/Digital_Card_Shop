import type { BirthdayArtSlug } from "@/lib/cards/birthday/designs";
import styles from "./BirthdayTileArt.module.css";

/** Quiet collection portraits that identify the five physical birthday objects. */
export function BirthdayTileArt({ design }: { design: BirthdayArtSlug }) {
  return (
    <div className={`${styles.scene} ${styles[design]}`} aria-hidden="true">
      {design === "velvet-encore" && (
        <svg viewBox="0 0 320 380" fill="none">
          <path d="M47 316V92Q48 52 160 44Q272 52 273 92V316" stroke="#c8a16f" strokeWidth="3"/>
          <path d="M61 308V101Q65 68 160 61Q255 68 259 101V308" stroke="#a78356" strokeWidth="1"/>
          <path d="M78 307V106Q107 75 160 75Q213 75 242 106V307Z" fill="#231b25"/>
          <path d="M78 100Q104 155 160 190Q215 155 242 100" stroke="#e1c497" strokeWidth="1" opacity=".52"/>
          <path d="M76 83Q118 130 157 206V312H70Q84 230 61 155Z" fill="#702e3c"/>
          <path d="M244 83Q202 130 163 206V312H250Q236 230 259 155Z" fill="#702e3c"/>
          <path d="M78 88Q111 168 134 309M97 91Q126 174 148 309M242 88Q209 168 186 309M223 91Q194 174 172 309" stroke="#a4616a" strokeWidth="5" opacity=".6"/>
          <path d="M67 235Q111 262 156 235M164 235Q209 262 253 235" stroke="#d3af78" strokeWidth="3"/>
          <path d="M158 235v31m-6 0h12l-6 21Z" fill="#dab780" stroke="#dab780" strokeWidth="2"/>
        </svg>
      )}
      {design === "birthday-bloom" && (
        <svg viewBox="0 0 320 380" fill="none">
          <path d="M45 327Q113 229 150 172Q188 116 275 57" stroke="#788b71" strokeWidth="3"/>
          <path d="M105 267Q68 233 43 232Q51 279 97 284ZM199 127Q223 86 256 90Q249 125 199 140Z" fill="#b0b9a3" stroke="#849c80"/>
          <g transform="translate(155 179)">
            {[0,45,90,135,180,225,270,315].map((angle) => (
              <g transform={`rotate(${angle})`} key={angle}>
                <ellipse cx="0" cy="-63" rx="28" ry="66" fill="#dca99e" stroke="#ba8a83" strokeWidth="1"/>
                <path d="M0 -18V-109M-6 -49L0 -73L7 -91" stroke="#aa756e" opacity=".55"/>
              </g>
            ))}
            <circle r="37" fill="#d6c39c" stroke="#9b8d6b" strokeWidth="2"/>
            <circle r="25" fill="none" stroke="#a99974" strokeDasharray="2 4"/>
            {[0,45,90,135,180,225,270,315].map((angle) => (
              <circle key={angle} cx={Math.cos(angle*Math.PI/180)*16} cy={Math.sin(angle*Math.PI/180)*16} r="2" fill="#a68f69"/>
            ))}
          </g>
        </svg>
      )}
      {design === "golden-parcel" && (
        <svg viewBox="0 0 320 380" fill="none">
          <path d="M45 141L159 110L277 141V274L163 307L45 274Z" fill="#e5d1b2" stroke="#ae9173" strokeWidth="2"/>
          <path d="M159 110V307M45 141L163 174L277 141" stroke="#b3987b" strokeWidth="1.5" opacity=".65"/>
          <path d="M132 119L169 113L186 299L151 307Z" fill="#b77379" opacity=".95"/>
          <path d="M44 198L163 233L278 199V231L164 266L44 231Z" fill="#bd7c80"/>
          <path d="M151 121Q84 81 106 57Q138 45 166 114Q199 43 236 64Q248 95 169 120" fill="#cb8d8b" stroke="#a5656b" strokeWidth="3"/>
          <path d="M149 121Q122 87 123 72M172 114Q214 93 218 76" stroke="#e9c8bd" strokeWidth="4"/>
          <path d="M159 118Q132 152 110 170M171 122Q201 148 224 162" stroke="#b7747a" strokeWidth="9"/>
        </svg>
      )}
      {design === "another-orbit" && (
        <svg viewBox="0 0 320 380" fill="none">
          <ellipse cx="160" cy="198" rx="119" ry="68" transform="rotate(-23 160 198)" stroke="#acc4c6" strokeWidth="1.5" opacity=".7"/>
          <circle cx="105" cy="113" r="41" fill="#ca9579" stroke="#f0bd9d" strokeWidth="2"/>
          <path d="M68 130Q98 108 133 89" stroke="#edc9a7" opacity=".6"/>
          <g transform="translate(162 193) rotate(24)">
            <path d="M0 -111Q45 -70 31 39L-32 39Q-45 -70 0 -111Z" fill="#e7dbbd" stroke="#375b68" strokeWidth="3"/>
            <path d="M0 -111Q20 -84 29 -54H-29Q-20 -84 0 -111Z" fill="#b96f62"/>
            <circle cy="-30" r="17" fill="#416977" stroke="#b2c8c6" strokeWidth="5"/>
            <path d="M-32 5L-57 55L-19 43M31 5L57 55L19 43" fill="#b86b61" stroke="#ab8a7b" strokeWidth="2"/>
            <path d="M-11 39Q0 93 11 39Z" fill="#e6b179"/>
          </g>
          <circle cx="264" cy="114" r="3" fill="#ebcfaa"/><circle cx="66" cy="262" r="3" fill="#ebcfaa"/>
        </svg>
      )}
      {design === "birthday-record" && (
        <svg viewBox="0 0 320 380" fill="none">
          <rect x="38" y="61" width="243" height="254" rx="3" fill="#d0a382" stroke="#865b4a" strokeWidth="3"/>
          <path d="M55 83H266M55 292H266" stroke="#9b6c55" strokeWidth="1" opacity=".65"/>
          <circle cx="195" cy="192" r="111" fill="#25262a" stroke="#4a3d3c" strokeWidth="4"/>
          {[104,88,73,58,43].map((radius) => <circle key={radius} cx="195" cy="192" r={radius} stroke="#666062" strokeWidth="1" opacity=".6"/>)}
          <circle cx="195" cy="192" r="40" fill="#bb7967" stroke="#d5b29b" strokeWidth="3"/>
          <circle cx="195" cy="192" r="14" fill="#e2c4a0"/>
          <circle cx="195" cy="192" r="4" fill="#343135"/>
          <path d="M45 63V315M52 63V315" stroke="#e3c4a3" strokeWidth="2" opacity=".7"/>
        </svg>
      )}
    </div>
  );
}
