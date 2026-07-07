package com.tsarajoro.skillforge.domain;

/** Types d evenements anti-fraude detectes cote candidat pendant la passation. */
public enum FraudEventType {
    FOCUS_LOSS,
    PASTE_SUSPICIOUS,
    FAST_ANSWER,
    DEVTOOLS_OPEN
}
