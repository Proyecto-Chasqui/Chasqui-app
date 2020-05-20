export default {
    //'http://69.61.93.71/chasqui-dev-panel/'
    //local: 'http://192.168.0.25:8080/chasqui/'
    BASE_URL: 'http://192.168.0.25:8080/chasqui/',
    CATALOG_VIEW_MODES : {
        TWOCARDS: "Mosaico",
        SINGLECARD: "Galería",
        LIST: "Lista",
    },
    APIKEY: 'AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4',
    image_1: 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQoSURBVFhHzZlbaBxVGMfPmezOJlYpojb6Uit4qdYH+6hPVrRVxAt90WLWGrSmWmtpqUZsk46JlYBUqsZLQZRkYwp5qaBCKcWXPihCn4pCESF4qbf60pK0O7s7x983F1ovO9cN5g//+c73zWTmP2e/850zJ9oemVynlJ5QSvXCxYRTcBMCaz/RqMAPYB12Ak3YCJq50AOfha5CoIEv+OFFBDTtEm1W6M+HNhfs0akVpMrb3PA7eBoeIXZXeDovzskhEpgbiHlGGfMtefwc7vXwCngPsaOcG5BriqCQQATswrwLJWf+CQ3HuWafcj4qBaHsyC2QB9+OGQm8thBhO2yr9ErgZkeRHtwGZdQfgn/CvfArKKAy6I3YqCo8rQ4ckB7NAGPkWETgGrjHHa6uV7q8HLvbeGotsf1a6zvc4b5J2lEPX1n6rfuysJ0JuQSWnZo8bBlv+YX47tCjfhVoONWzCN1eH+r7UXzLa76B+V1ONb0ef1RmRS6B2lL9Yk2Xd9IPtMF5p/885iCc7+46d6kfTI0gI0KBJmN+KEcOpUYpzWxxGi71jLU+cFOjUA7KVKaaXd6NvhePlaHNNfXlFViTgzb6Pt9rh9cmyhzvhn8orQ/7sYzIJdDtnd+JkTKzuceZ7PaD/4FK03oEM0c63eoO9clgyYC/5WDGFBwYMG7FfYfWmZalZTb5Fyjky0iiMTjsDlUziruAvD+xUoNPtnivKq3nEbM1rKs+yiNT12A+h8ca3vfTfjAzihdq6l/1hDHmXpqDrF6+RugofF8rI+Xnm7LX3Kgc54LyHCgkUNDY8/iXKFhJb36IS/FWZ+A6CvYTc06/K9cUgayo5Q23csPxIJQM1n69RukqmXsn7gooRdiWcyFEmHAOzsJj9PRBXuYX2qmALhmE+6MeTDdKxmZK/OFuLp/lD14ncj9cBa+FkncRxb8B3gYfhvuYn2fLI7WxJXunL36ROGTLQduZvsR265/RHIVtS0sMbF5qsNFqHZZ7hbFEpBM4M6OV1ZLRyBdgYazhXvKBlgqpBNon61JOHgq8jmADqfJg2I5FskApR0a9HHqdhL/giEG6HLRf/fhmzE2B11GsroxOJC420vSgjNIFAUuw1WGzLdIIXBq2Og5GtRT2WCQL1Dpt3coDWY7FIhIYV6gXUmDcc9MNEq7K/dHdCSQKjHvFhYXfgSlykMEW2o4DCYnv/78KTEC6HAQ/QPm+7TTm6L6Y7+qgcxMFsk48pDzvKpoPwDfhcZh391R2Fz7h4Y/BXu79aRBuj2jBuo2L3wpCyag4tR5jqVtoyjR4HVwOr4aXwwiyWJV95l/hLFP6ibIpHZ93NqTaZkbXFsy4NGQL+KUgvHiAphdFW7SJLsX4PVhoKzglpK4mzSCyqf8UrCNwai0DRv4NIT/RYsLPSqlNfwFYKTkRj1YtQwAAAABJRU5ErkJggg==',
    image_2: 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARGSURBVFhHzZlbaFRHGMfnO9mt8VLrrRetbSn11t3Y1oc+1AsGauqtoBaxGwOCtEGwoIJFarLKttl4R7RVLFhorbquPgi+CNpC+yBofYgP7mpIREqp0eCDWCGSRM/0/52ZIwlhc2bOHiQ/+OebmT2X/8755nI2dDqZXiiFOCaEeBUaSnQIKeopn0z/i8ow6Ceomz+JgCdQryqGYji0Huphg+hAsSVVzO7lT4YK8NWIkHVUlbpULI9cctuEU1XpD/PJbW/opnJ4zH+0wfLIV6Xfxzc+7wjZSVJcFUL+g/pF6G19SGjKNggT65HMMCUWQ32vVwNdOpVoDNWbpKO+IKehPTC3BuEw9ILXMJBJRHQTxy3XdWtC9+Dpd9NjEdhcKbwcAiOhYyeT28epqhnoMq/XQhuUjliJMErVBnCFSH6A+KuqitEVwv1Yl60oJwc/gu5Av0MXoBy0XRLNbi3GZn9eaG6TJDegrRNixutohTZIfk7aMBknHcX8WQMtguqgptpC0+WMyHiPp7bQ/BDhey7jHvxlrAnVg0j6FQjVcHFbtQwGnVVRVqloTFk5+CkUh3hJCkDGdIGnIWvCGryr4ywdB8M/xj/HCm3Q601zyP0Rf29Ay07O/MbvoVLwaO/AjXapqinKU6geTBV2YAck61CcWOHG1qrWgeQT6fcQlkJ1q4rZa16jJaEM/lGdwQCmJl3dnZ/ZOEWXn4H1eQTWq19QrIA2qXNswKoOrA3mpmXinfefnECRBwozQrj0Zz7ZWK3rApvgqXhCPD/6+bcM5xw/O2MrDywrtEHzeXB1W6YX6+u3eMT86JYQuW8iIr/oHKafVqgFX/062lpI0FskaREuXgPD333WutNiE6tyUG9YaUOq2PSD1xKSXFXDKEfSHEFOpXDlX6kb2Xv6o1DgiWyErwOhDJ5JNLzskvMFikug6dBoiHc0fsrwq0MP9B/UDv3mkvvz6sIO46kGvniZPKgvqLrTBJz4JczxTXdC86BXoEqobz7zO86L0OsQ52azI512nLvR/E4Kq0GCG/B7y1HoJa/BDt52HcAA2qeqZhgbhLl1CF+rWllsxrVqdXkQVF8bGcwl07zZ3KNqkbAfL1al9pI+nkOjHHQE8arBAyEqXhPCDehFNfP5PRgwD8pnk3B00EJdGBTTHJysY5QMWB77078Hg+BpJGqCctBDGwxc6Uq9VpZDUFr1HSSBWC/yUWFq0PQ4GwJ60C4Hn+r43NEGA1dIV8fnSb8cDBolD3SMkg4dS6A6zegRD4vH5uKE+ShmoUuQ/7uLLfchbDZowcjKGF8vEL0flJtSxeaDui2QM7O2xt3uigT6PYHqOxDvqidCYyD/aTyCuJewcaVbJN2Wrq749bV/Z4zSBWv1V/B1yP8JuCFVzPL+bsgAX1sQdrNB/hGdJ+IjUCQ/BQfA79FB8yr7qYe62eAnKPC/IbDDGFLcEYLq/wcXiCN1dEaKpAAAAABJRU5ErkJggg==',
    image_3:'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',
    image_4:'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAO4SURBVFhHzZlNaBNBFMfnbdLPpFWRqmhtN6CICIq9FBQURSyoJ28WT2IRvQiC1SZFQ21S7UH05CeIoAcvgnoQBPWgxUNBBVHBS1Nara2WapvU1jQZ/7MzCzlYM/tRya/8d957Cc3r7JuZly2lk2YLY+w2tBwqJb4QY20iwWE4FdBNaFa84gNzUFaarqiCjkG/GRLk6YR50gqXEMgrJnIzLI/YtDWWFr/ERSa4gKR7zO08brr+nAVPkHF2KVPO2pXnAG5dZYLS9sx0wqxH3VxNJyIrVEiwFmqf7G5cJF1n+DqD2ezcKIZWRrx/Kmk2yyjLQ0sMg7qkqwtZ0+Zrgoviw2JreQTVYw/ryyTNXbDfi9fAVjU6wv8a5JTAdQYKYApuYPwuwmC1Gh3he4Lh2MAHDEnpMROyb/VSHl8ZULY2MkHCj49QINeL4Z30WJ0aA5mKanFC6OJfDU7EzeB0d2PdVFdDSPihU0M4MvkhmDnh2/B8timdbHR0qz0lyPE3ZnoiG8rK+fG8QecpaIxhm3kN3cU8HsZbPsl3SoioE9fHytXCU4KEwqieFTVHk3D3QtXQZqgVOgKthwoRq7pHmnrYNeiK6W6zNlNuPoR5HdJq14j4A2Vq4XoG0QGF8wZ7DnOfjBRFbNgXQx2DaekWxeMiIXYG1ybp6GGQ09PEWw0eUKMuRp7lG5VdFGv6gKsEpxKRNRjqpacPcXLcMMgEubNlQpR3dGttMCtnv11Yp3WaIDEvNUjLlOGUXZVzs3uUrYWjBGd6V1VhE74D87KMOISza0Yw90R5WjhKsLL9869wNHWQc2qAm5JRBxB7Lo9BHeQykQk63KgNIyfaKReLhL9Vpg7ua5Bz4xyGoPS04TlG48ouChfnKNBOcCoZqUsnIy2owXtwj8poUYYgNLCis6Hm2ljKbl610U4wXJkdJ8bFE4OP0AvI3kvnYxTTsAk12xmODt4KRwf6VVwP9dutBFEblvMv6MRwPhRNPcUHxqFtCInvGH9bKKJRzUB30V1PWBEP2DPouJ9Bkq/Q322BKVp8m/uIb8S4H3pmRdyC2yUGV4vEJtQxMMKJ7YCp2nveZw1EiwMs99KyPeIpQUFNR2oMX2l2wnwDfRUxHIUvqqJDP4XtmsIa9EooOvAdM7kTG7i1z4VOD45YL/iAStBlS10AZvJHTSxVWI9e8V6DC4qft3ghKd0EVdVZCWI2xdfFUsN6CGA/RC+HrkD/41GwaDLKpDkvIp82aFYkuBuG+DdE4UPHUuAzMdb2B5QJBnMZQeGYAAAAAElFTkSuQmCC',
};