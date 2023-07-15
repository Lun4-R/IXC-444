addLayer("b", {
    name: "boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L-2", // This appears on the layer's node. Default is the id with the first letter capitalized
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
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    boosterCalc() {
      let Base = player.b.best
      let Power = new Decimal(10)
      
      return new Decimal.pow(Power, Base)
    },
    upgrades: {
      11 : {
        title: `Units ^ 2`,
        cost: 2,
        description: `Units boost themselves with log10(x)^3`,
        effect() {
          let Units = player.main.units
          Units = Units.add(1)
          let Logarithm = new Decimal(10)
          return new Decimal.log(Units, Logarithm).add(1).pow(3)
        },
        effectDisplay() {
          return `x${format(upgradeEffect(this.layer, this.id))}`;
        },
      },
      12: {
        title: `Reducant v1`,
        cost: 4,
        description: `Node MK.I-IV scale per 10 is decreased by 10%`,
      },
      13: {
        title: `3-Dimensional Nodes`,
        cost: 5,
        description: `Node MK.I-IV boost per 10 is increased by 10%`,
      }
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
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
          "upgrades"
          ]
        },
    },
    layerShown(){return hasMilestone("main", "ComputerV") || player.b.best.gte(1)}
})