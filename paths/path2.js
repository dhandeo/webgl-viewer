
function initPath2 () {
PATHS[PATH_COUNT] = new Tree();
PATHS[PATH_COUNT].Color = [0.2, 1.0, 1.0, 1.0];
PATHS[PATH_COUNT].Paths[0] = new Path();
PATHS[PATH_COUNT].Paths[0].Points = [
8231.89333333335, 8054.61333333332, 10, 
8239.146666666684, 8066.1333333333205, 20, 
8235.73333333335, 8064.426666666654, 30, 
8228.906666666684, 8049.066666666654, 40, 
8230.400000000018, 8045.01333333332, 50, 
8227.733333333352, 8037.439999999986, 60, 
8228.426666666684, 8033.759999999986, 70, 
8228.186666666685, 8028.239999999984, 80, 
8227.080000000018, 8020.706666666651, 90, 
8231.446666666687, 8019.593333333316, 100, 
8235.943333333355, 8021.043333333315, 110, 
8246.648333333356, 8002.938333333313, 120, 
8256.432500000024, 7994.054166666644, 130, 
8258.685416666694, 7993.6579166666415, 140, 
8258.96312500003, 7988.498541666638, 150, 
8263.840520833364, 7989.385312499967, 160, 
8267.544531250034, 7988.330885416629, 170, 
8271.974088541705, 7984.387369791622, 180, 
8278.479570312542, 7982.331783854115, 190, 
8284.945761718798, 7978.80501953119, 200, 
8287.24637695318, 7974.04208658847, 210, 
8294.88252115892, 7972.282778320227, 220, 
8289.003996582109, 7973.658275553284, 230, 
8294.873114013764, 7971.0849035643305, 240, 
8297.406482544056, 7976.432978718928, 250, 
8298.668463236625, 7978.508078918278, 260, 
8303.500696563884, 7977.519647267443, 270, 
8307.387821172279, 7976.897019119, 280, 
8310.671823819723, 7974.142372652369, 290, 
8314.966837444605, 7971.959519519414, 300, 
8316.433241218298, 7970.886122312067, 310, 
8318.822617907974, 7973.4273405752665, 320, 
8322.471348285433, 7968.803157870048, 330, 
8326.223603705846, 7968.504977045365, 340, 
8331.11878494962, 7967.3144044120145, 350, 
8337.266868470444, 7964.2579363303885, 360, 
8339.54462856295, 7963.265325560558, 370, 
8342.365140991502, 7962.352166484821, 380, 
8347.988319012444, 7959.444380854558, 390, 
8352.922377616776, 7955.757603116643, 400, 
8357.05125214369, 7952.003741894685, 410, 
8358.42097438645, 7937.44286293295, 420, 
8352.117302073453, 7937.962103972146, 430, 
8351.71476430179, 7929.917687733231, 440, 
8344.353187047507, 7929.541327319172, 450, 
8340.732626711368, 7920.470559512282, 460, 
8346.133622363659, 7914.711453949018, 470, 
8345.903051394593, 7915.641670390243, 480, 
8347.957983568136, 7920.2118419257795, 490, 
8351.57066199652, 7920.509149799194, 500, 
8350.875848479627, 7922.127997724271, 510, 
8352.935580355477, 7921.104494724619, 520, 
8355.424378749149, 7921.550821124039, 530, 
8356.924570458797, 7920.791656786461, 540, 
8357.815598115048, 7920.123486317556, 550, 
8360.255606994833, 7920.0596487806915, 560, 
8360.111221117675, 7918.034062609017, 570, 
8357.01121311378, 7916.655265520295, 580, 
8357.035687279811, 7912.3611551216645, 590, 
8355.4257274223, 7908.511908292151, 600, 
8356.496313907946, 7910.1508311337175, 610, 
8358.798864305028, 7908.605280607096, 620, 
8360.960452817639, 7906.727343349811, 630, 
8365.86114884864, 7911.381727545308, 640, 
8364.570232985654, 7905.597175751103, 650, 
8367.882583992632, 7904.093123323108, 660, 
8371.343649580129, 7903.62934664309, 670, 
8374.084899945872, 7901.03315619198, 680, 
8372.015566759315, 7898.751146412418, 690, 
8374.082058142658, 7896.080157957073, 700, 
8369.904595757256, 7894.4388969473985, 710, 
8374.214443662948, 7892.421767325108, 720, 
8368.487215448098, 7887.550411114786, 730, 
8364.836460767485, 7885.4188710269755, 740, 
8365.715726605931, 7886.882191400097, 750, 
8362.319701410757, 7875.152403437592, 760, 
8360.942611058754, 7874.500066265661, 770, 
8363.689019537722, 7877.573997218337, 780, 
8361.822332670283, 7877.613233460791, 790, 
8361.573648300046, 7875.856981805724, 800, 
8361.889166920691, 7876.535439575756, 810, 
8354.16257394551, 7875.589494087799, 820, 
8358.012694583123, 7877.990957734635, 830, 
8358.365551057996, 7876.49794569909, 840, 
8356.603743126649, 7876.479198760758, 850, 
8359.10432771722, 7874.790717763904, 860, 
8361.356810950932, 7873.190597778538, 870, 
8363.705774230735, 7873.670257151595, 880, 
8366.403456449445, 7869.279119680347, 890, 
8371.759687482225, 7866.523320638569, 900, 
8371.841125747873, 7862.763015401919, 910, 
8373.775468173108, 7857.309394527081, 920, 
8372.768140701604, 7858.577865283781, 930, 
8371.139033977961, 7854.605137606387, 940, 
8369.507988093006, 7852.659532041954, 950, 
8371.640914719623, 7850.3346007993905, 960, 
8371.077301728632, 7846.212968557195, 970, 
8376.593102270634, 7842.0168840326, 980, 
8378.428992692783, 7837.12222669459, 990, 
8378.40969834603, 7833.929372975522, 1000, 
8376.52922998806, 7832.480908518019, 1010, 
8381.190627180107, 7829.4195874273955, 1020, 
8382.998111090435, 7825.568267793798, 1030, 
8385.718984129306, 7822.241048536269, 1040, 
8390.31386119993, 7819.681118545394, 1050, 
8394.022144876508, 7819.505217437727, 1060, 
8399.534161769543, 7819.460358926358, 1070, 
8401.321750589661, 7816.790014121402, 1080, 
8401.279028617859, 7815.344461909406, 1090, 
8401.920803821868, 7813.264084145246, 1100, 
8401.83412484803, 7818.272613421357, 1110, 
8403.370311977214, 7818.160579738001, 1120, 
8405.269286990224, 7812.315305318964, 1130, 
8407.796861907736, 7812.694249239157, 1140, 
8410.778230437589, 7812.465067148058, 1150, 
8410.642189667777, 7810.043977519753, 1160, 
8417.808641006555, 7817.441646953477, 1170, 
8418.121197222632, 7816.8286791439705, 1180, 
8421.792680615154, 7809.197151808593, 1190, 
8424.807926088843, 7810.053738953014, 1200, 
8430.014235296654, 7814.466451619449, 1210, 
8432.974087666997, 7810.298671190521, 1220, 
8436.858124526252, 7812.556097548152, 1230, 
8443.309890411623, 7813.807276845721, 1240, 
8439.71771796912, 7818.5976894588575, 1250, 
8444.79619978685, 7817.627198593026, 1260, 
8446.631904083815, 7818.8827491154625, 1270, 
8446.159577586579, 7816.300485250333, 1280, 
8448.100507395307, 7815.151883146071, 1290, 
8449.752661199536, 7815.62089208926, 1300, 
8451.313039757397, 7814.416630242826, 1310, 
8453.889770842807, 7813.474702739072, 1320, 
8455.504402566557, 7812.6361125355725, 1330, 
8457.526939916734, 7811.1437227587285, 1340, 
8459.353889996404, 7817.18726901668, 1350, 
8460.805949573203, 7816.483552155484, 1360, 
8459.616723076526, 7816.7006052987745, 1370, 
8458.528281323088, 7816.065713235464, 1380, 
8458.11547698643, 7815.931602011523, 1390, 
8456.770240693044, 7820.775626939542, 1400, 
8455.77366616797, 7820.679804426592, 1410, 
8460.369691923745, 7817.8668500221565, 1420, 
8461.070132725736, 7819.26114069414, 1430, 
8463.220078742082, 7818.503897571439, 1440, 
8464.809951695806, 7817.842610810528, 1450, 
8467.030081581837, 7817.830491204713, 1460, 
8472.143389343217, 7818.821833126668, 1470, 
8471.058377977119, 7820.260800904282, 1480, 
8469.062591117774, 7815.496562617826, 1490, 
8470.078845885742, 7821.156264991049, 1500, 
8472.459907490338, 7817.630147589906, 1510, 
8476.147338913614, 7822.288154266052, 1520, 
8476.703046144867, 7818.857283423497, 1530, 
8481.295146274428, 7816.854459306388, 1540, 
8481.872765666472, 7819.026615164629, 1550, 
8484.735479042902, 7817.822512280584, 1560, 
8486.618362158586, 7816.8784600424615, 1570, 
8488.853303433998, 7820.730460410498, 1580, 
8488.930238984427, 7819.4490497001, 1590, 
8488.46761895519, 7820.2623184098575, 1600, 
8488.965580686825, 7819.820914260221, 1610, 
8489.021719313238, 7819.366141185083, 1620, 
8491.627459477642, 7819.324686927574, 1630, 
8494.487379738868, 7818.002537853099, 1640, 
8497.24827926489, 7817.093349649538, 1650, 
8501.361559240715, 7815.530287215099, 1660, 
8504.095275788919, 7814.913087358861, 1670, 
8504.20589048061, 7814.648362111742, 1680, 
8504.27136275514, 7814.705868342844, 1690, 
8504.446264512353, 7814.293658906717, 1700, 
8503.768425540737, 7816.970611347311, 1710, 
8501.843026404133, 7818.985069298429, 1720, 
8507.455524895246, 7811.738003109541, 1750, 
8508.533488420026, 7810.460175210953, 1760, 
8509.63601985967, 7810.19162380944, 1770, 
8502.439183254106, 7820.728234398279, 1780, 
8508.46434576687, 7820.530016709314, 1790, 
8508.429774440292, 7824.711604125161, 1800, 
8515.933318397269, 7819.598260949688, 1810, 
8517.133719302183, 7818.606607558726, 1820, 
8515.068406069839, 7816.791569650099, 1830, 
8515.401055217944, 7814.538219079234, 1840, 
8526.228256961616, 7817.128198144007, 1850, 
8526.082192458, 7817.668993436648, 1860, 
8530.735752318746, 7815.547705329922, 1870, 
8529.869767535813, 7818.185781788599, 1880, 
8531.690522822912, 7814.874573610896, 1890, 
8528.948021338701, 7811.770697031353, 1900, 
8528.054155848678, 7809.882192882069, 1910, 
8527.573016671779, 7813.83706509547, 1920, 
8530.207596929547, 7810.7583108377585, 1930, 
8530.837384724971, 7813.238784407628, 1940, 
8534.362332496452, 7817.903746837075, 1950, 
8535.623657075455, 7815.670421041211, 1960, 
8537.905020481743, 7815.13980947627, 1970, 
8539.732171693462, 7810.116988677257, 1980, 
8544.977091291967, 7810.916942930681, 1990, 
8547.947141733555, 7809.820203875416, 2000, 
8547.848202359462, 7808.013734408322, 2010, 
8545.50621769246, 7812.0821072738545, 2020, 
8547.050780892707, 7811.384689445441, 2030, 
8554.70926713895, 7809.180265563787, 2040, 
8553.873132862027, 7806.776864474852, 2050, 
8558.05659044681, 7807.110909742018, 2060, 
8556.732828557195, 7804.547353223639, 2070, 
8558.59794259965, 7804.790897053565, 2080, 
8557.12034746846, 7802.944580009587, 2090, 
8561.345559312618, 7800.861415143372, 2100, 
8562.371924690331, 7797.738446103239, 2110, 
8560.418915735672, 7798.90555396141, 2120, 
8562.92153320261, 7796.0327076039885, 2130, 
8566.269520147607, 7796.178353834296, 2140, 
8570.351651209578, 7795.398307699825, 2150, 
8571.051352279863, 7791.084684569032, 2160, 
8572.982928485155, 7792.87733971822, 2170, 
8573.77963265393, 7792.506832660182, 2180, 
8575.493623376105, 7791.0610951403605, 2190, 
8578.568092257561, 7791.049300426025, 2200, 
8580.934007477097, 7788.001947446594, 2210, 
8581.951194888681, 7785.7495048398005, 2220, 
8582.193313978303, 7787.360376356188, 2230, 
8583.152591505339, 7787.649247654603, 2240, 
8583.408550186126, 7784.912897758607, 2250, 
8582.430561168183, 7783.2145942180105, 2260, 
8581.269184763121, 7782.848369815589, 2270, 
8578.620814725346, 7786.847930896081, 2280, 
8576.226946994955, 7787.815447464818, 2290, 
8577.391806575008, 7789.2625407548885, 2300, 
8577.586450814286, 7787.349626224539, 2310, 
8581.76260219209, 7782.053807222101, 2320, 
8585.38376312399, 7781.732987100742, 2330, 
8588.953074731815, 7778.394876940335, 2340, 
8589.51638669058, 7775.6241689649005, 2350, 
8587.846612273159, 7771.129349836301, 2360, 
8583.10470351441, 7771.800864537414, 2370, 
8582.740517905706, 7768.077191669286, 2380, 
8581.485916846601, 7770.703703021479, 2390, 
8579.158902466657, 7768.357546280735, 2400, 
8580.599335276112, 7766.635887152395, 2410, 
8582.088743961316, 7765.91523489395, 2420, 
8579.403490852006, 7766.9343341635185, 2430, 
8579.952451711348, 7765.796061438244, 2440, 
8579.629009928965, 7765.376148581167, 2450, 
8579.679142912792, 7765.106605424776, 2460, 
8580.670302276518, 7764.192741055404, 2470, 
8581.45589422577, 7763.391080863985, 2480, 
8579.382669707504, 7767.518547005393, 2490, 
8583.927766438193, 7769.577851129035, 2500, 
8585.983165185698, 7768.857072832516, 2510, 
8586.540133998997, 7769.030068816782, 2520, 
8588.838866144742, 7769.785829722477, 2530, 
8588.734415998018, 7772.876485685864, 2540, 
8591.390041404176, 7774.0328587792055, 2550, 
8593.3883284401, 7772.267587093751, 2560, 
8593.529726254445, 7769.24179911272, 2570, 
8594.64738138266, 7768.70445582615, 2580, 
8592.862718038567, 7771.586921016288, 2590, 
8595.159912837798, 7775.513254644223, 2600, 
8597.681672796141, 7770.968982409975, 2610, 
8601.332151836215, 7772.954579035221, 2620, 
8605.140202068373, 7770.651741378021, 2630, 
8603.303680016992, 7768.22098474492, 2640, 
8601.848016960752, 7769.406985912392, 2650, 
8600.825949523021, 7769.766522684311, 2660, 
8601.228823250345, 7770.177246670789, 2670, 
8602.751394867022, 7771.58204430039, 2680, 
8603.203083820157, 7772.66957349439, 2690, 
8604.391650968724, 7773.694432232762, 2700, 
8608.95973149458, 7772.466358347081, 2710, 
8609.503899808358, 7775.468515370427, 2720, 
8610.09430780246, 7773.881319641779, 2730, 
8610.385636219327, 7773.548096679619, 2740, 
8613.231921915034, 7777.075632512555, 2750, 
8612.962599635039, 7775.745857750286, 2760, 
8613.543412217994, 7775.39812680454, 2770, 
8615.122300217328, 7776.323141867, 2780, 
8616.067489368475, 7777.65356321089, 2790, 
8615.059934235194, 7781.167415941191, 2800, 
8619.231528577127, 7782.34539384285, 2810, 
8619.152809423693, 7785.356519830775, 2820, 
8618.562136117967, 7778.541331474052, 2830, 
8617.326570392686, 7781.068289240482, 2840, 
8621.494091300467, 7777.016403605964, 2850, 
8629.491398905519, 7777.966345493558, 2860, 
8628.98269696596, 7777.678852503312, 2870, 
8633.104093585931, 7778.11746746806, 2880, 
8635.922428061996, 7784.641332732441, 2890, 
8641.271275973568, 7783.712159685216, 2900, 
8644.855565477372, 7787.155479942835, 2910, 
8650.731301423093, 7788.261152846889, 2920, 
8650.882404770307, 7788.364396237445, 2930, 
8655.687969168677, 7790.69051451356, 2940, 
8661.104171014329, 7792.458031798922, 2950, 
8665.437272476614, 7794.129804608273, 2960, 
8668.448039663099, 7791.039175460353, 2970, 
8672.694741576976, 7790.360172600416, 2980, 
8675.9300268583, 7791.444576334497, 2990, 
8680.749737382475, 7790.101962197608, 3000, 
8687.32725290883, 7789.633355566236, 3010, 
8688.670175241423, 7788.416613715813, 3020, 
8690.346916099652, 7788.609299073138, 3030, 
8688.74550545824, 7794.262967510903, 3040, 
8690.094631732949, 7787.617773483232, 3050, 
8695.926859978714, 7794.471686700275, 3060, 
8698.716831918246, 7797.402880513844, 3070, 
8705.409161814916, 7800.252837015315, 3080, 
8710.5064268559, 7805.290368781357, 3090, 
8715.662876961158, 7810.699709821898, 3100, 
8719.869232815949, 7826.734791142591, 3110, 
8750.565934983133, 7863.442434872895, 3120, 
8755.662355713417, 7863.505134585331, 3130, 
8764.142095089546, 7870.707846967047, 3140, 
8768.78519289301, 7869.227708212608, 3150, 
8771.49482184795, 7867.853678215797, 3160, 
8772.157721581882, 7870.454616697697, 3170, 
8775.738868161383, 7867.341334896355, 3180, 
8779.215705795568, 7866.398148238228, 3190, 
8788.196147769379, 7868.230383249443, 3200, 
8794.935360863126, 7865.411599858649, 3220, 
8800.693607213998, 7864.873399006463, 3230, 
8801.192557923212, 7864.537691057248, 3240, 
8809.824096333463, 7867.81134496115, 3250, 
8814.281797401964, 7866.877884179067, 3260, 
8795.902559162614, 7825.640126765369, 3270, 
8824.830893115648, 7855.258011286097, 3280, 
8831.480958173406, 7851.541344448571, 3290, 
8837.947205225793, 7851.126407916657, 3300, 
8861.102861590716, 7846.376215158967, 3350, 
8869.425512494918, 7843.215317095402, 3360, 
8872.18445632234, 7842.038970085483, 3370, 
8888.023081870615, 7834.081917836563, 3410, 
8884.843192010563, 7830.49476917536, 3420, 
8880.60536510172, 7826.694495215339, 3430, 
8903.162486158075, 7829.688924446933, 3440, 
8893.665521635148, 7823.225761085449, 3460, 
8898.07668644744, 7819.591257040494, 3470, 
8902.972347120301, 7827.132971286406, 3480, 
8907.997277601413, 7825.854994706143, 3490, 
8913.883155584546, 7827.16961151649, 3500, 
8918.373056819766, 7825.838788754486, 3510, 
8926.073411669498, 7821.778364155192, 3520];
PATHS[PATH_COUNT].Paths[0].CreateBuffer();
++PATH_COUNT;
}
