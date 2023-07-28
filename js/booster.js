addLayer("b", {
    name: "boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    rawText() {
      let state = []
      let per = tmp.b.calculatePercentageFromLog10
      if (per > 100) {
        state = `+`
      }
      return `
          <p>L-3
          <p class='cBreak' style='font-size:14px'>${format(tmp.b.calculatePercentageFromLog10)}%<sup>${state}</sup></p>
          <p class='cBreak' style='font-size:8px'>${format(player.b.points)} Boosters</p>
          </p>`
    },
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0)
    }},
    color: "#42e3f5",
    requires: new Decimal(10e24), // Can be a function that takes requirement increases into account
    resource: "Boosters", // Name of prestige currency
    baseResource: "Units", // Name of resource prestige is based on
    baseAmount() {return player.main.units}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["c"],
    exponent: 2.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    canBuyMax() {
      return false
    },
    boosterCalc() {
      let Base = player.b.best
      let Power = new Decimal(25)
      
      return new Decimal.pow(Power, Base)
    },
    calculatePercentageFromLog10() {
     const maxLog10 = Math.log10(25); // Replace 'maxValue' with the maximum possible value

     const log10Value = Math.log10(player.b.points);
     const normalizedValue = log10Value / maxLog10;
     const percentage = normalizedValue * 100;

     return percentage;
    },
    upgrades: {
      11 : {
        title: `Units ^ 2`,
        cost: 2,
        description: `Units boost themselves with log10(x)^3`,
        effect() {
          if (hasUpgrade(this.layer, this.id)) {
            let Units = player.main.units
            Units = Units.add(1)
            let Logarithm = new Decimal(10)
            return new Decimal.log(Units, Logarithm).add(1).pow(3)
          }
          else return new Decimal(1)
        },
        effectDisplay() {
          return `x${format(upgradeEffect(this.layer, this.id))}`;
        },
      },
      12: {
        title: `Multiproduction`,
        cost: 6,
        description: `Computer exponent is -5% weaker`,
      },
      13: {
        title: `3-Dimensional Nodes`,
        cost: 9,
        description: `Stars are useful now! Very minor boost to per 10 boost`,
      },
      
      21: {
          title: `Units ^ 3`,
          cost: 30,
          description: `Units boost themselves with log10(x)^4`,
          effect() {
            if (hasUpgrade(this.layer, this.id)) {
            let Units = player.main.units
            Units = Units.add(1)
            let Logarithm = new Decimal(10)
            return new Decimal.log(Units, Logarithm).add(1).pow(4)
            }
            else return new Decimal(1)
          },
          effectDisplay() {
            return `x${format(upgradeEffect(this.layer, this.id))}`;
          },
          unlocked() { 
            return hasMilestone("b", "BoosterIII")
          }
        },
        22: {
          title: `Mass production`,
          cost: 40,
          description: `???`,
          unlocked() {
            return hasMilestone("b", "BoosterIII")
          }
        },
        23: {
          title: `4-Dimensional Nodes`,
          cost: 55,
          description: `???`,
          unlocked() {
            return hasMilestone("b", "BoosterIII")
          }
        }
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    milestones: {
        "BoosterI": {
          requirementDescription() {
            return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">8 Boosters</b>`
          },
          done() { return player.b.points.gte(8) },
          effectDescription: `<b style="font-size:22px">
              + Unlock 3 new Computer milestones`,
          style() {
            return {
              "width": "600px",
              "height": "auto",
              "padding": "5px",
              "border": "0px solid",
              "border-radius": "10px",
            }
          },
          unlocked() {
            return player.b.best.gte(1)
          }
        },
        "BoosterII": {
         requirementDescription() {
          return `<b style="font-size:32px; text-shadow: 0px 0px 10px #000000">9 Boosters</b>`
         },
         done() { return player.b.points.gte(9) },
         effectDescription: `<b style="font-size:22px">
                      + Unlock ability to buymax Computers`,
         style() {
          return {
           "width": "600px",
           "height": "auto",
           "padding": "5px",
           "border": "0px solid",
           "border-radius": "10px",
          }
         },
         unlocked() {
          return player.b.best.gte(1)
         }
        },
    },
    tabFormat: {
        "Upgrades": {
          content: [
          "blank",
          ['raw-html', () => {
              return `<MA style='font-size: 24px'>You have <HI style='font-size: 30px; text-shadow: 0px 0px 20px; color:#42e3f5'>${format(player.b.points)}</HI> Boosters</MA>`
                    }],
          ['raw-html', () => {
             return `<MA style='font-size: 20px'>Your best Boosters give <HI style='font-size: 26px; text-shadow: 0px 0px 20px; color:#39d2e3'>${format(tmp.b.boosterCalc)}x</HI> boost to Unit gain</MA>`
                    }],
          ['raw-html', () => {
            return `<MA style='font-size: 16px'>Your current best Boosters are <HI style='font-size: 22px; text-shadow: 0px 0px 20px; color:#2dbecf'>${format(player.b.best)}</HI> Boosters</MA>`
                              }],
          "blank",
          "blank",
          "prestige-button",
          "blank",
          "blank",
          "milestones",
          "blank",
          "upgrades"
          ]
        },
        
    },
    layerShown(){return hasMilestone("c", "ComputerVI") || player.b.best.gte(1)}
})