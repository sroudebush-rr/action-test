using NUnit.Framework;
using User;

namespace Tests {
public class BasicTests {
    [Test]
    public void AdditionShouldWork() {
        var lhs = 4;
        var rhs = 5;
        var expected = 9;
        var result = Math.Add(lhs, rhs);

        Assert.AreEqual(expected, result);
    }
}
}
